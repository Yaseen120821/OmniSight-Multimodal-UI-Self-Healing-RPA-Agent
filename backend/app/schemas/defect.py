"""Pydantic v2 schemas for Defect."""

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.defect import DefectSeverity, DefectStatus


class DefectCreate(BaseModel):
    """Fields the client supplies when registering a defect."""

    screenshot_id: Optional[int] = Field(
        None,
        description="Optional ID of the Screenshot this defect relates to.",
    )
    defect_type: str = Field(
        ...,
        min_length=1,
        max_length=128,
        description="Category label, e.g. 'layout_shift', 'missing_element'.",
        examples=["color_contrast"],
    )
    severity: DefectSeverity = Field(
        DefectSeverity.medium,
        description="Impact level of the defect.",
    )
    description: str = Field(
        ...,
        min_length=1,
        description="Human-readable explanation of the defect.",
    )
    location_data: Optional[Dict[str, Any]] = Field(
        None,
        description="JSON bounding-box or coordinate data.",
        examples=[{"x": 100, "y": 200, "width": 300, "height": 50}],
    )
    confidence_score: Optional[float] = Field(
        None,
        ge=0.0,
        le=1.0,
        description="AI confidence score between 0.0 and 1.0.",
    )

    @field_validator("confidence_score")
    @classmethod
    def validate_confidence(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and not (0.0 <= v <= 1.0):
            raise ValueError("confidence_score must be between 0.0 and 1.0")
        return v


class DefectUpdate(BaseModel):
    """Editable fields on an existing defect."""

    status: Optional[DefectStatus] = None
    severity: Optional[DefectSeverity] = None
    description: Optional[str] = Field(None, min_length=1)


class DefectResponse(BaseModel):
    """Defect record returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    test_run_id: int
    screenshot_id: Optional[int]
    defect_type: str
    severity: DefectSeverity
    description: str
    location_data: Optional[Dict[str, Any]]
    confidence_score: Optional[float]
    status: DefectStatus
    created_at: datetime
