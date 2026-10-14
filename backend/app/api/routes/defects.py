"""
Defect routes.

Endpoints
---------
POST   /api/v1/test-runs/{run_identifier}/defects  — register defect
GET    /api/v1/test-runs/{run_identifier}/defects  — list defects
PATCH  /api/v1/defects/{defect_id}                 — update status / fields
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.defect import Defect
from app.models.screenshot import Screenshot
from app.models.test_run import TestRun
from app.schemas.defect import DefectCreate, DefectResponse, DefectUpdate

router = APIRouter(tags=["Defects"])


def _get_run_or_404(run_identifier: str, db: Session) -> TestRun:
    run = db.execute(
        select(TestRun).where(TestRun.run_identifier == run_identifier)
    ).scalar_one_or_none()
    if run is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Test run '{run_identifier}' not found.",
        )
    return run


@router.post(
    "/test-runs/{run_identifier}/defects",
    response_model=DefectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a defect for a test run",
)
def create_defect(
    run_identifier: str,
    body: DefectCreate,
    db: Session = Depends(get_db),
) -> Defect:
    run = _get_run_or_404(run_identifier, db)

    # Validate screenshot_id belongs to the same run (if provided)
    if body.screenshot_id is not None:
        screenshot = db.execute(
            select(Screenshot).where(
                Screenshot.id == body.screenshot_id,
                Screenshot.test_run_id == run.id,
            )
        ).scalar_one_or_none()
        if screenshot is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=(
                    f"Screenshot {body.screenshot_id} not found for run '{run_identifier}'."
                ),
            )

    defect = Defect(
        test_run_id=run.id,
        screenshot_id=body.screenshot_id,
        defect_type=body.defect_type,
        severity=body.severity,
        description=body.description,
        location_data=body.location_data,
        confidence_score=body.confidence_score,
    )
    db.add(defect)
    db.commit()
    db.refresh(defect)
    return defect


@router.get(
    "/test-runs/{run_identifier}/defects",
    response_model=list[DefectResponse],
    summary="List defects for a test run",
)
def list_defects(
    run_identifier: str,
    db: Session = Depends(get_db),
) -> list[Defect]:
    run = _get_run_or_404(run_identifier, db)
    defects = db.execute(
        select(Defect)
        .where(Defect.test_run_id == run.id)
        .order_by(Defect.created_at.desc())
    ).scalars().all()
    return list(defects)


@router.patch(
    "/defects/{defect_id}",
    response_model=DefectResponse,
    summary="Update a defect (status, severity, description)",
)
def update_defect(
    defect_id: int,
    body: DefectUpdate,
    db: Session = Depends(get_db),
) -> Defect:
    defect = db.get(Defect, defect_id)
    if defect is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Defect {defect_id} not found.",
        )

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(defect, field, value)

    db.commit()
    db.refresh(defect)
    return defect
