"""Report database model.

Records the metadata for a generated report (PDF, JSON, HTML).
The Day 2 API registers report metadata only; actual PDF/HTML generation
is implemented in Day 5 (Report Generation phase).
"""

import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, ForeignKey, Index, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ReportFormat(str, enum.Enum):
    pdf  = "pdf"
    json = "json"
    html = "html"


class ReportStatus(str, enum.Enum):
    pending   = "pending"
    generated = "generated"
    failed    = "failed"


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    test_run_id: Mapped[int] = mapped_column(
        ForeignKey("test_runs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    report_format: Mapped[ReportFormat] = mapped_column(
        Enum(ReportFormat, name="report_format_enum"),
        nullable=False,
        default=ReportFormat.pdf,
    )

    # Path or object-storage reference to the generated file.
    # NULL until the report is actually generated.
    file_path: Mapped[str | None] = mapped_column(String(2048), nullable=True)

    status: Mapped[ReportStatus] = mapped_column(
        Enum(ReportStatus, name="report_status_enum"),
        nullable=False,
        default=ReportStatus.pending,
        server_default="pending",
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=_utcnow,
        server_default=func.now(),
    )

    # Set by the report-generation service once the file is ready.
    generated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ---- Relationships -------------------------------------------------
    test_run: Mapped["TestRun"] = relationship(  # noqa: F821
        "TestRun", back_populates="reports"
    )

    __table_args__ = (
        Index("ix_reports_status", "status"),
    )

    def __repr__(self) -> str:
        return (
            f"<Report id={self.id} run={self.test_run_id} "
            f"format={self.report_format} status={self.status}>"
        )
