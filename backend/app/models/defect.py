"""Defect database model.

A defect represents a visual or functional issue discovered during a TestRun.
It may be linked to a specific Screenshot.
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import (
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class DefectSeverity(str, enum.Enum):
    low      = "low"
    medium   = "medium"
    high     = "high"
    critical = "critical"


class DefectStatus(str, enum.Enum):
    open         = "open"
    acknowledged = "acknowledged"
    fixed        = "fixed"
    ignored      = "ignored"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Defect(Base):
    __tablename__ = "defects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    test_run_id: Mapped[int] = mapped_column(
        ForeignKey("test_runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Optional — a defect may not be linked to a specific screenshot.
    # SET NULL so defect history is preserved if the screenshot is deleted.
    screenshot_id: Mapped[int | None] = mapped_column(
        ForeignKey("screenshots.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # Category label (e.g. "layout_shift", "color_contrast", "missing_element").
    defect_type: Mapped[str] = mapped_column(String(128), nullable=False)

    severity: Mapped[DefectSeverity] = mapped_column(
        Enum(DefectSeverity, name="defect_severity_enum"),
        nullable=False,
        default=DefectSeverity.medium,
    )

    description: Mapped[str] = mapped_column(Text, nullable=False)

    # JSON blob for bounding-box coordinates or other location metadata.
    # Example: {"x": 100, "y": 200, "width": 300, "height": 50}
    location_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Confidence score from 0.0 (uncertain) to 1.0 (certain). Populated by
    # the AI vision module in Day 4+.
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)

    status: Mapped[DefectStatus] = mapped_column(
        Enum(DefectStatus, name="defect_status_enum"),
        nullable=False,
        default=DefectStatus.open,
        server_default="open",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        server_default=func.now(),
    )

    # ---- Relationships -------------------------------------------------
    test_run: Mapped["TestRun"] = relationship(  # noqa: F821
        "TestRun", back_populates="defects"
    )
    screenshot: Mapped["Screenshot | None"] = relationship(  # noqa: F821
        "Screenshot", back_populates="defects"
    )

    __table_args__ = (
        Index("ix_defects_severity", "severity"),
        Index("ix_defects_status", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<Defect id={self.id} run={self.test_run_id} "
            f"type={self.defect_type!r} severity={self.severity}>"
        )
