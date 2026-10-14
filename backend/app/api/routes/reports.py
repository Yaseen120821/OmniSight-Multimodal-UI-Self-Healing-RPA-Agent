"""
Report routes.

Endpoints
---------
POST  /api/v1/test-runs/{run_identifier}/reports  — register report metadata
GET   /api/v1/test-runs/{run_identifier}/reports  — list reports for a run
GET   /api/v1/reports/{report_id}                 — retrieve single report

Day 2 registers metadata only. Actual PDF/HTML generation is Day 5.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.report import Report
from app.models.test_run import TestRun
from app.schemas.report import ReportCreate, ReportResponse

router = APIRouter(tags=["Reports"])


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
    "/test-runs/{run_identifier}/reports",
    response_model=ReportResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register report metadata for a test run",
)
def create_report(
    run_identifier: str,
    body: ReportCreate,
    db: Session = Depends(get_db),
) -> Report:
    run = _get_run_or_404(run_identifier, db)

    report = Report(
        test_run_id=run.id,
        report_format=body.report_format,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get(
    "/test-runs/{run_identifier}/reports",
    response_model=list[ReportResponse],
    summary="List reports for a test run",
)
def list_reports(
    run_identifier: str,
    db: Session = Depends(get_db),
) -> list[Report]:
    run = _get_run_or_404(run_identifier, db)
    reports = db.execute(
        select(Report)
        .where(Report.test_run_id == run.id)
        .order_by(Report.created_at.desc())
    ).scalars().all()
    return list(reports)


@router.get(
    "/reports/{report_id}",
    response_model=ReportResponse,
    summary="Retrieve a single report by ID",
)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
) -> Report:
    report = db.get(Report, report_id)
    if report is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report {report_id} not found.",
        )
    return report
