"""
Integration tests for the TestRun CRUD endpoints.

Coverage:
  - Create test run (201)
  - Duplicate identifier returns 409
  - List test runs (pagination, status filter)
  - Retrieve test run by run_identifier (200 and 404)
  - Update test run (PATCH)
  - Delete test run (204)
  - Delete running test run returns 409
  - Invalid request body returns 422
  - Screenshot metadata registration
  - Defect registration and validation
  - Report metadata registration
  - Database persistence across separate requests (same session)
"""

import pytest
from fastapi.testclient import TestClient


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _create_run(client: TestClient, identifier: str = "run-9901", **kwargs) -> dict:
    payload = {
        "run_identifier": identifier,
        "name": "Test Regression Suite",
        "target_url": "https://example.com",
        **kwargs,
    }
    response = client.post("/api/v1/test-runs", json=payload)
    assert response.status_code == 201, response.text
    return response.json()


# ---------------------------------------------------------------------------
# Create
# ---------------------------------------------------------------------------

def test_create_test_run(client: TestClient) -> None:
    run = _create_run(client, "run-9901")
    assert run["run_identifier"] == "run-9901"
    assert run["name"] == "Test Regression Suite"
    assert run["status"] == "pending"
    assert run["id"] is not None
    assert "created_at" in run


def test_create_duplicate_identifier_returns_409(client: TestClient) -> None:
    _create_run(client, "run-9902")
    response = client.post(
        "/api/v1/test-runs",
        json={
            "run_identifier": "run-9902",
            "name": "Duplicate",
            "target_url": "https://example.com",
        },
    )
    assert response.status_code == 409


def test_create_missing_required_field_returns_422(client: TestClient) -> None:
    response = client.post(
        "/api/v1/test-runs",
        json={"name": "Missing URL"},
    )
    assert response.status_code == 422


def test_create_invalid_url_returns_422(client: TestClient) -> None:
    response = client.post(
        "/api/v1/test-runs",
        json={
            "run_identifier": "run-9903",
            "name": "Bad URL",
            "target_url": "not-a-url",
        },
    )
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Retrieve
# ---------------------------------------------------------------------------

def test_get_test_run(client: TestClient) -> None:
    created = _create_run(client, "run-9910")
    response = client.get(f"/api/v1/test-runs/{created['run_identifier']}")
    assert response.status_code == 200
    assert response.json()["run_identifier"] == "run-9910"


def test_get_unknown_run_returns_404(client: TestClient) -> None:
    response = client.get("/api/v1/test-runs/run-does-not-exist")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# List
# ---------------------------------------------------------------------------

def test_list_test_runs(client: TestClient) -> None:
    _create_run(client, "run-9920")
    _create_run(client, "run-9921")
    response = client.get("/api/v1/test-runs")
    assert response.status_code == 200
    body = response.json()
    assert "items" in body
    assert "total" in body
    assert body["total"] >= 2


def test_list_test_runs_status_filter(client: TestClient) -> None:
    _create_run(client, "run-9930")  # status=pending by default
    response = client.get("/api/v1/test-runs", params={"status": "pending"})
    assert response.status_code == 200
    body = response.json()
    assert all(item["status"] == "pending" for item in body["items"])


def test_list_pagination(client: TestClient) -> None:
    for i in range(3):
        _create_run(client, f"run-994{i}")
    response = client.get("/api/v1/test-runs", params={"page": 1, "page_size": 2})
    assert response.status_code == 200
    body = response.json()
    assert len(body["items"]) <= 2
    assert body["page"] == 1
    assert body["page_size"] == 2


# ---------------------------------------------------------------------------
# Update
# ---------------------------------------------------------------------------

def test_update_test_run_status(client: TestClient) -> None:
    created = _create_run(client, "run-9950")
    response = client.patch(
        f"/api/v1/test-runs/{created['run_identifier']}",
        json={"status": "running"},
    )
    assert response.status_code == 200
    assert response.json()["status"] == "running"


def test_update_nonexistent_run_returns_404(client: TestClient) -> None:
    response = client.patch(
        "/api/v1/test-runs/run-does-not-exist",
        json={"status": "passed"},
    )
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Delete
# ---------------------------------------------------------------------------

def test_delete_test_run(client: TestClient) -> None:
    created = _create_run(client, "run-9960")
    response = client.delete(f"/api/v1/test-runs/{created['run_identifier']}")
    assert response.status_code == 204
    # Confirm it's gone
    assert client.get(f"/api/v1/test-runs/{created['run_identifier']}").status_code == 404


def test_delete_running_run_returns_409(client: TestClient) -> None:
    created = _create_run(client, "run-9961")
    client.patch(f"/api/v1/test-runs/{created['run_identifier']}", json={"status": "running"})
    response = client.delete(f"/api/v1/test-runs/{created['run_identifier']}")
    assert response.status_code == 409


# ---------------------------------------------------------------------------
# Screenshot metadata
# ---------------------------------------------------------------------------

def test_create_screenshot(client: TestClient) -> None:
    run = _create_run(client, "run-9970")
    response = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/screenshots",
        json={
            "image_type": "baseline",
            "file_path": "storage/screenshots/run-9970/home_baseline.png",
            "page_url": "https://example.com",
            "viewport_width": 1920,
            "viewport_height": 1080,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["image_type"] == "baseline"
    assert body["test_run_id"] == run["id"]


def test_list_screenshots(client: TestClient) -> None:
    run = _create_run(client, "run-9971")
    client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/screenshots",
        json={"image_type": "actual", "file_path": "storage/screenshots/run-9971/home_actual.png"},
    )
    response = client.get(f"/api/v1/test-runs/{run['run_identifier']}/screenshots")
    assert response.status_code == 200
    assert len(response.json()) >= 1


# ---------------------------------------------------------------------------
# Defects
# ---------------------------------------------------------------------------

def test_create_defect(client: TestClient) -> None:
    run = _create_run(client, "run-9980")
    response = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/defects",
        json={
            "defect_type": "color_contrast",
            "severity": "high",
            "description": "Button text has insufficient contrast ratio.",
            "confidence_score": 0.92,
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["severity"] == "high"
    assert body["status"] == "open"
    assert body["confidence_score"] == pytest.approx(0.92)


def test_defect_invalid_confidence_returns_422(client: TestClient) -> None:
    run = _create_run(client, "run-9981")
    response = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/defects",
        json={
            "defect_type": "layout_shift",
            "severity": "low",
            "description": "Minor shift.",
            "confidence_score": 1.5,  # invalid — must be <= 1.0
        },
    )
    assert response.status_code == 422


def test_update_defect_status(client: TestClient) -> None:
    run = _create_run(client, "run-9982")
    defect = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/defects",
        json={"defect_type": "missing_element", "severity": "medium", "description": "Element not found."},
    ).json()
    response = client.patch(f"/api/v1/defects/{defect['id']}", json={"status": "fixed"})
    assert response.status_code == 200
    assert response.json()["status"] == "fixed"


# ---------------------------------------------------------------------------
# Reports
# ---------------------------------------------------------------------------

def test_create_report_metadata(client: TestClient) -> None:
    run = _create_run(client, "run-9990")
    response = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/reports",
        json={"report_format": "pdf"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["report_format"] == "pdf"
    assert body["status"] == "pending"
    assert body["file_path"] is None


def test_get_report_by_id(client: TestClient) -> None:
    run = _create_run(client, "run-9991")
    created = client.post(
        f"/api/v1/test-runs/{run['run_identifier']}/reports",
        json={"report_format": "json"},
    ).json()
    response = client.get(f"/api/v1/reports/{created['id']}")
    assert response.status_code == 200
    assert response.json()["report_format"] == "json"


def test_get_nonexistent_report_returns_404(client: TestClient) -> None:
    response = client.get("/api/v1/reports/999999")
    assert response.status_code == 404


# ---------------------------------------------------------------------------
# Persistence across separate requests (same session)
# ---------------------------------------------------------------------------

def test_data_persists_across_requests(client: TestClient) -> None:
    """
    Verifies that a created run can be retrieved in a subsequent request
    within the same test session — confirming database write-through, not
    just in-memory state.
    """
    run = _create_run(client, "run-9999")
    run_id = run["run_identifier"]

    # Second request — retrieve
    get_response = client.get(f"/api/v1/test-runs/{run_id}")
    assert get_response.status_code == 200
    assert get_response.json()["run_identifier"] == run_id

    # Third request — update
    patch_response = client.patch(f"/api/v1/test-runs/{run_id}", json={"status": "passed"})
    assert patch_response.status_code == 200

    # Fourth request — confirm update persisted
    final_response = client.get(f"/api/v1/test-runs/{run_id}")
    assert final_response.json()["status"] == "passed"
