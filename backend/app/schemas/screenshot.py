"""Pydantic v2 schemas for Screenshot."""

from datetime import datetime
from typing import Optional

from pydantic import AnyHttpUrl, BaseModel, ConfigDict, Field

from app.models.screenshot import ImageType


class ScreenshotCreate(BaseModel):
    """Fields the client supplies when registering a screenshot."""

    image_type: ImageType = Field(
        ...,
        description="Whether this is a baseline, actual, or diff screenshot.",
    )
    file_path: str = Field(
        ...,
        min_length=1,
        max_length=2048,
        description="Relative path or object-storage key for the image file.",
        examples=["storage/screenshots/run-3116/baseline_home.png"],
    )
    page_url: Optional[AnyHttpUrl] = Field(
        None,
        description="URL of the page that was captured.",
    )
    viewport_width: Optional[int] = Field(None, gt=0, le=7680)
    viewport_height: Optional[int] = Field(None, gt=0, le=4320)


class ScreenshotResponse(BaseModel):
    """Screenshot metadata returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    test_run_id: int
    image_type: ImageType
    file_path: str
    page_url: Optional[str]
    viewport_width: Optional[int]
    viewport_height: Optional[int]
    captured_at: datetime
