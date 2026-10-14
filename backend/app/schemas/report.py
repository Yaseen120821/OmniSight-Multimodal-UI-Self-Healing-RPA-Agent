"""Pydantic v2 schemas for Report."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.report import ReportFormat, ReportStatus


class ReportCreate(BaseModel):
    """Fields the client supplies when requesting a report."""

    report_format: ReportFormat = Field(
        ReportFormat.pdf,
        description="Desired output format: pdf, json, or html.",
    )


class ReportResponse(BaseModel):
    """Report metadata returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    test_run_id: int
    report_format: ReportFormat
    file_path: Optional[str]
    status: ReportStatus
    created_at: datetime
    generated_at: Optional[datetime]
