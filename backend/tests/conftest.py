"""
pytest configuration and shared fixtures.

Uses a separate PostgreSQL test database (port 5433, see docker-compose.yml).
Each test function gets a clean transaction that is rolled back after the test,
ensuring test isolation without recreating the schema on every run.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings
from app.db.base import Base
from app.db.session import get_db
from app.main import app

settings = get_settings()

# ---------------------------------------------------------------------------
# Test engine — points at the TEST database (port 5433).
# ---------------------------------------------------------------------------
test_engine = create_engine(
    settings.test_database_url,
    pool_pre_ping=True,
)

TestSessionLocal = sessionmaker(
    bind=test_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)


# ---------------------------------------------------------------------------
# Create all tables in the test DB once per session.
# WARNING: this drops and re-creates only in the *test* database.
# ---------------------------------------------------------------------------
@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create all tables in the test database before any test runs."""
    Base.metadata.create_all(bind=test_engine)
    yield
    # Tables are left in place between runs to allow inspection.
    # Uncomment the next line to tear down after each test session:
    # Base.metadata.drop_all(bind=test_engine)


# ---------------------------------------------------------------------------
# Per-test DB session with rollback isolation.
# ---------------------------------------------------------------------------
@pytest.fixture()
def db_session() -> Session:
    """
    Yield a database session that is rolled back after each test.
    This keeps tests isolated without recreating the schema.
    """
    connection = test_engine.connect()
    transaction = connection.begin()
    session = TestSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


# ---------------------------------------------------------------------------
# FastAPI test client that uses the test DB session.
# ---------------------------------------------------------------------------
@pytest.fixture()
def client(db_session: Session) -> TestClient:
    """
    Return a TestClient whose database dependency is overridden to use the
    per-test rolled-back session.
    """

    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
