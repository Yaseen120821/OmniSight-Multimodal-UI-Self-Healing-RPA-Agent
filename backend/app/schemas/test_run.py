"""
Pydantic v2 schemas for TestRun.

Three schema tiers:
  - TestRunCreate  — what the client sends to create a run.
  - TestRunUpdate  — what the client sends to update a run (all optional).
  - TestRunResponse — what the API returns (includes server-managed fields).
"""

from datetime import datetime
from typing import Optional

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field

from app.models.test_run import RunStatus


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------
class TestRunCreate(BaseModel):
    """Fields the client must/may supply when creating a test run."""

    run_identifier: str = Field(
        ...,
        min_length=1,
        max_length=64,
        description="Unique public identifier, e.g. 'run-3116'.",
        examples=["run-3116"],
    )
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Human-readable test run name.",
        examples=["Commerce Portal — Full Regression"],
    )
    target_url: AnyHttpUrl = Field(
        ...,
        description="URL of the application under test.",
        examples=["https://commerce.example.com"],
    )
    summary: Optional[str] = Field(
        None,
        description="Optional initial summary text.",
    )


# ---------------------------------------------------------------------------
# Update
# ---------------------------------------------------------------------------
class TestRunUpdate(BaseModel):
    """All fields are optional; only supplied fields are updated."""

    name: Optional[str] = Field(None, min_length=1, max_length=255)
    target_url: Optional[AnyHttpUrl] = None
    status: Optional[RunStatus] = None
    summary: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None


# ---------------------------------------------------------------------------
# Response
# ---------------------------------------------------------------------------
class TestRunResponse(BaseModel):
    """Shape of a test run returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    run_identifier: str
    name: str
    target_url: str
    status: RunStatus
    summary: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Paginated list
# ---------------------------------------------------------------------------
class TestRunListResponse(BaseModel):
    """Paginated list of test runs."""

    total: int
    page: int
    page_size: int
    items: list[TestRunResponse]
