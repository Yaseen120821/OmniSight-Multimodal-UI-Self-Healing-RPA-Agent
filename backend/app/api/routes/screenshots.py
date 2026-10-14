"""
Screenshot metadata routes.

Endpoints
---------
POST  /api/v1/test-runs/{run_identifier}/screenshots  — register screenshot
GET   /api/v1/test-runs/{run_identifier}/screenshots  — list screenshots

Note: Day 2 registers metadata only. Actual image capture happens in Day 3
(Playwright automation).
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.screenshot import Screenshot
from app.models.test_run import TestRun
from app.schemas.screenshot import ScreenshotCreate, ScreenshotResponse

router = APIRouter(tags=["Screenshots"])


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
    "/test-runs/{run_identifier}/screenshots",
    response_model=ScreenshotResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register screenshot metadata for a test run",
)
def create_screenshot(
    run_identifier: str,
    body: ScreenshotCreate,
    db: Session = Depends(get_db),
) -> Screenshot:
    run = _get_run_or_404(run_identifier, db)

    screenshot = Screenshot(
        test_run_id=run.id,
        image_type=body.image_type,
        file_path=body.file_path,
        page_url=str(body.page_url) if body.page_url else None,
        viewport_width=body.viewport_width,
        viewport_height=body.viewport_height,
    )
    db.add(screenshot)
    db.commit()
    db.refresh(screenshot)
    return screenshot


@router.get(
    "/test-runs/{run_identifier}/screenshots",
    response_model=list[ScreenshotResponse],
    summary="List screenshots for a test run",
)
def list_screenshots(
    run_identifier: str,
    db: Session = Depends(get_db),
) -> list[Screenshot]:
    run = _get_run_or_404(run_identifier, db)
    screenshots = db.execute(
        select(Screenshot)
        .where(Screenshot.test_run_id == run.id)
        .order_by(Screenshot.captured_at)
    ).scalars().all()
    return list(screenshots)
