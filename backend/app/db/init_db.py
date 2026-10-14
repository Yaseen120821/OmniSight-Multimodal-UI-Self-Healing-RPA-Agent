"""
Database initialization helper.

NOT used as the primary migration mechanism — Alembic handles that.
This module is available as a convenience for seeding or one-off setup
during development (e.g. running in CI without Alembic).

Usage:
    python -m app.db.init_db
"""

from app.db.base import Base
from app.db.session import engine


def init_db() -> None:
    """
    Create all tables that don't exist yet.

    WARNING: Does NOT run Alembic migrations.
    Use ``alembic upgrade head`` for production-safe schema management.
    """
    # Import models so they register on Base.metadata
    import app.models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    print("Database tables created (or already exist).")


if __name__ == "__main__":
    init_db()
