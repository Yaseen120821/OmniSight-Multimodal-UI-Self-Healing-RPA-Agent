"""
OmniSight models package.

Import all model classes here so that Alembic's ``env.py`` can discover
them by importing this single module.
"""

from app.models.test_run import TestRun, RunStatus
from app.models.screenshot import Screenshot, ImageType
from app.models.defect import Defect, DefectSeverity, DefectStatus
from app.models.report import Report, ReportFormat, ReportStatus

__all__ = [
    "TestRun", "RunStatus",
    "Screenshot", "ImageType",
    "Defect", "DefectSeverity", "DefectStatus",
    "Report", "ReportFormat", "ReportStatus",
]
