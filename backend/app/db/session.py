"""
Database session factory and FastAPI dependency.

Usage in route handlers::

    from app.db.session import get_db
    from sqlalchemy.orm import Session

    @router.get("/items")
    def list_items(db: Session = Depends(get_db)):
        ...
"""

from typing import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------
# connect_args is not needed for psycopg 3 (it handles pools natively).
engine = create_engine(
    settings.database_url,
    # Echo SQL statements when DEBUG is enabled — useful during development.
    echo=settings.debug,
    pool_pre_ping=True,   # verify connections before checkout
    pool_size=5,
    max_overflow=10,
)

# ---------------------------------------------------------------------------
# Session factory
# ---------------------------------------------------------------------------
SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# FastAPI dependency
# ---------------------------------------------------------------------------
def get_db() -> Generator[Session, None, None]:
    """
    Yield a database session and guarantee it is closed afterwards.

    Use this function as a FastAPI ``Depends`` argument::

        db: Session = Depends(get_db)
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_db_connection() -> bool:
    """
    Return True if the database is reachable, False otherwise.

    Used by the health endpoint.  Errors are swallowed so the health
    endpoint can still return a structured response rather than crash.
    """
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
