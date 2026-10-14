"""
Test Run CRUD routes.

Endpoints
---------
POST   /api/v1/test-runs                       — create
GET    /api/v1/test-runs                       — list (paginated, optional status filter)
GET    /api/v1/test-runs/{run_identifier}      — retrieve
PATCH  /api/v1/test-runs/{run_identifier}      — partial update
DELETE /api/v1/test-runs/{run_identifier}      — delete

Deletion policy
---------------
Test runs are historical records.  The DELETE endpoint is provided for
completeness (e.g. cleaning up test data) but is protected by a guard:
runs with status "running" cannot be deleted.  Cascaded deletion removes
associated screenshots, defects, and reports.  Do NOT use DELETE in
production to remove runs with business value.
"""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.test_run import TestRun, RunStatus
from app.schemas.test_run import (
    TestRunCreate,
    TestRunListResponse,
    TestRunResponse,
    TestRunUpdate,
)

router = APIRouter(prefix="/test-runs", tags=["Test Runs"])


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _get_run_or_404(run_identifier: str, db: Session) -> TestRun:
    """Return the TestRun for ``run_identifier`` or raise a 404."""
    run = db.execute(
        select(TestRun).where(TestRun.run_identifier == run_identifier)
    ).scalar_one_or_none()
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test run '{run_identifier}' not found.",
        )
    return run


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post(
    "",
    response_model=TestRunResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new test run",
)
def create_test_run(
    body: TestRunCreate,
    db: Session = Depends(get_db),
) -> TestRun:
    # Check uniqueness of run_identifier
    existing = db.execute(
        select(TestRun).where(TestRun.run_identifier == body.run_identifier)
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A test run with identifier '{body.run_identifier}' already exists.",
        )

    run = TestRun(
        run_identifier=body.run_identifier,
        name=body.name,
        target_url=str(body.target_url),
        summary=body.summary,
    )
    db.add(run)
    db.commit()
    db.refresh(run)
    return run


@router.get(
    "",
    response_model=TestRunListResponse,
    summary="List test runs",
)
def list_test_runs(
    status_filter: Optional[RunStatus] = Query(
        None,
        alias="status",
        description="Filter by run status.",
    ),
    page: int = Query(1, ge=1, description="Page number (1-indexed)."),
    page_size: int = Query(20, ge=1, le=100, description="Results per page."),
    db: Session = Depends(get_db),
) -> TestRunListResponse:
    base_query = select(TestRun)
    count_query = select(func.count()).select_from(TestRun)

    if status_filter:
        base_query = base_query.where(TestRun.status == status_filter)
        count_query = count_query.where(TestRun.status == status_filter)

    total: int = db.execute(count_query).scalar_one()

    runs = db.execute(
        base_query
        .order_by(TestRun.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    ).scalars().all()

    return TestRunListResponse(
        total=total,
        page=page,
        page_size=page_size,
        items=list(runs),
    )


@router.get(
    "/{run_identifier}",
    response_model=TestRunResponse,
    summary="Retrieve a single test run",
)
def get_test_run(
    run_identifier: str,
    db: Session = Depends(get_db),
) -> TestRun:
    return _get_run_or_404(run_identifier, db)


@router.patch(
    "/{run_identifier}",
    response_model=TestRunResponse,
    summary="Update a test run",
)
def update_test_run(
    run_identifier: str,
    body: TestRunUpdate,
    db: Session = Depends(get_db),
) -> TestRun:
    run = _get_run_or_404(run_identifier, db)

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        # Convert AnyHttpUrl → str for SQLAlchemy
        if field == "target_url" and value is not None:
            value = str(value)
        setattr(run, field, value)

    db.commit()
    db.refresh(run)
    return run


@router.delete(
    "/{run_identifier}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a test run",
)
def delete_test_run(
    run_identifier: str,
    db: Session = Depends(get_db),
) -> None:
    run = _get_run_or_404(run_identifier, db)

    if run.status == RunStatus.running:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Cannot delete a test run while it is running.",
        )

    db.delete(run)
    db.commit()
