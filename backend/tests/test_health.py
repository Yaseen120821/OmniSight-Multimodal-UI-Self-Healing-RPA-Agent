"""Tests for GET /api/v1/health."""

from fastapi.testclient import TestClient


def test_health_returns_200_when_db_reachable(client: TestClient) -> None:
    """Health endpoint returns 200 and db:ok when the database is available."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["api"] == "ok"
    assert body["database"] == "ok"
    assert "service" in body


def test_root_endpoint(client: TestClient) -> None:
    """Root endpoint identifies the service."""
    response = client.get("/")
    assert response.status_code == 200
    body = response.json()
    assert "service" in body
    assert "docs" in body
    assert body["docs"] == "/docs"
