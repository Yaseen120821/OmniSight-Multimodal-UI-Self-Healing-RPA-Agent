"""OmniSight schemas package."""

from app.schemas.test_run import TestRunCreate, TestRunUpdate, TestRunResponse, TestRunListResponse
from app.schemas.screenshot import ScreenshotCreate, ScreenshotResponse
from app.schemas.defect import DefectCreate, DefectUpdate, DefectResponse
from app.schemas.report import ReportCreate, ReportResponse

__all__ = [
    "TestRunCreate", "TestRunUpdate", "TestRunResponse", "TestRunListResponse",
    "ScreenshotCreate", "ScreenshotResponse",
    "DefectCreate", "DefectUpdate", "DefectResponse",
    "ReportCreate", "ReportResponse",
]
