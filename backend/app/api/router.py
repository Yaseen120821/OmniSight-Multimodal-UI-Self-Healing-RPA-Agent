"""
Main API v1 router.

Aggregates all route modules under the /api/v1 prefix.
"""

from fastapi import APIRouter

from app.api.routes import health, test_runs, screenshots, defects, reports
from app.core.config import get_settings

settings = get_settings()

api_router = APIRouter(prefix=settings.api_v1_prefix)

# Health — /api/v1/health
api_router.include_router(health.router)

# Test runs — /api/v1/test-runs/...
api_router.include_router(test_runs.router)

# Screenshots — /api/v1/test-runs/{run_identifier}/screenshots
api_router.include_router(screenshots.router)

# Defects — /api/v1/test-runs/{run_identifier}/defects + /api/v1/defects/{id}
api_router.include_router(defects.router)

# Reports — /api/v1/test-runs/{run_identifier}/reports + /api/v1/reports/{id}
api_router.include_router(reports.router)
