"""
TestRun database model.

Represents one automated UI verification run against a target application.
Identifiers like ``run-3115`` match the frontend's existing naming convention.
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RunStatus(str, enum.Enum):
    """Allowed values for TestRun.status."""
    pending   = "pending"
    running   = "running"
    passed    = "passed"
    failed    = "failed"
    error     = "error"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class TestRun(Base):
    __tablename__ = "test_runs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Public identifier visible in the frontend and API responses.
    # Matches existing format: run-101, run-3115, run-3116, etc.
    run_identifier: Mapped[str] = mapped_column(
        String(64), unique=True, nullable=False, index=True
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    target_url: Mapped[str] = mapped_column(String(2048), nullable=False)

    status: Mapped[RunStatus] = mapped_column(
        Enum(RunStatus, name="run_status_enum"),
        nullable=False,
        default=RunStatus.pending,
        server_default="pending",
    )

    # Optional free-text executive summary added after the run completes.
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)

    # When the test agent actually started/finished executing.
    started_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    completed_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # Record bookkeeping — managed by the server, never by the client.
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        server_default=func.now(),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        onupdate=_utcnow,
        server_default=func.now(),
    )

    # ---- Relationships -------------------------------------------------
    # Screenshots captured during this run.
    screenshots: Mapped[list["Screenshot"]] = relationship(  # noqa: F821
        "Screenshot",
        back_populates="test_run",
        # Cascade delete-orphan so screenshots are cleaned up when a run is
        # explicitly deleted (rare — policy is to preserve history).
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Defects found during this run.
    defects: Mapped[list["Defect"]] = relationship(  # noqa: F821
        "Defect",
        back_populates="test_run",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # Reports generated from this run.
    reports: Mapped[list["Report"]] = relationship(  # noqa: F821
        "Report",
        back_populates="test_run",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    # ---- Indexes -------------------------------------------------------
    __table_args__ = (
        Index("ix_test_runs_status", "status"),
        Index("ix_test_runs_created_at", "created_at"),
    )

    def __repr__(self) -> str:
        return f"<TestRun id={self.id} run_identifier={self.run_identifier!r} status={self.status}>"
