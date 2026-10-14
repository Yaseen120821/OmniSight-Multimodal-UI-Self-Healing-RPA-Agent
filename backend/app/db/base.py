"""
Database declarative base.

All ORM models inherit from ``Base`` so that Alembic can discover
them for auto-generating migrations.  Import every model module in
``alembic/env.py`` to ensure they are registered.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Shared SQLAlchemy declarative base for all OmniSight models."""
    pass
