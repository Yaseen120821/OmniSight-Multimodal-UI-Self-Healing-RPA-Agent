"""Screenshot database model.

Stores metadata about screenshots captured during a TestRun.
Actual image bytes are NOT stored in the database; only the file path
or object-storage reference is kept here.  Image capture (Day 3) will
populate records via POST /api/v1/test-runs/{run_identifier}/screenshots.
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Index, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ImageType(str, enum.Enum):
    """Which stage of comparison the screenshot represents."""
    baseline = "baseline"
    actual   = "actual"
    diff     = "diff"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Screenshot(Base):
    __tablename__ = "screenshots"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Foreign key — a screenshot always belongs to exactly one test run.
    test_run_id: Mapped[int] = mapped_column(
        ForeignKey("test_runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    image_type: Mapped[ImageType] = mapped_column(
        Enum(ImageType, name="image_type_enum"),
        nullable=False,
    )

    # Path on local disk or reference to object storage (e.g. S3 key).
    # Never store raw image bytes in the database.
    file_path: Mapped[str] = mapped_column(String(2048), nullable=False)

    # URL of the page that was captured.
    page_url: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    viewport_width: Mapped[int | None]  = mapped_column(Integer, nullable=True)
    viewport_height: Mapped[int | None] = mapped_column(Integer, nullable=True)

    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        server_default=func.now(),
    )

    # ---- Relationships -------------------------------------------------
    test_run: Mapped["TestRun"] = relationship(  # noqa: F821
        "TestRun", back_populates="screenshots"
    )

    defects: Mapped[list["Defect"]] = relationship(  # noqa: F821
        "Defect",
        back_populates="screenshot",
        # Setting screenshot_id to NULL when a screenshot is deleted keeps
        # the defect record for auditing purposes.
        cascade="save-update, merge",
        passive_deletes=True,
    )

    __table_args__ = (
        Index("ix_screenshots_test_run_image_type", "test_run_id", "image_type"),
    )

    def __repr__(self) -> str:
        return (
            f"<Screenshot id={self.id} run={self.test_run_id} type={self.image_type}>"
        )
