"""
OmniSight FastAPI application entry point.

Authentication:  NOT YET IMPLEMENTED (Day 2 scope).
                 All endpoints are currently public.
                 Authentication (JWT / API key) will be added in a later phase.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings

settings = get_settings()

# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description=(
        "OmniSight — Multimodal UI Self-Healing & RPA Agent REST API.\n\n"
        "Provides persistent storage for test runs, screenshots, defects, "
        "and reports. Swagger UI is available at **/docs**, ReDoc at **/redoc**.\n\n"
        "> **Note:** Authentication is not yet implemented (Day 2 scope). "
        "Do not expose this API to the public internet without adding "
        "authentication first."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# ---------------------------------------------------------------------------
# CORS — allow the local Next.js frontend to call the API
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(api_router)


# ---------------------------------------------------------------------------
# Root endpoint
# ---------------------------------------------------------------------------
@app.get("/", tags=["Root"], summary="Service identification")
def root() -> dict:
    """Returns the service name and a pointer to the API documentation."""
    return {
        "service": settings.app_name,
        "version": "0.1.0",
        "environment": settings.app_env,
        "docs": "/docs",
        "health": f"{settings.api_v1_prefix}/health",
    }
