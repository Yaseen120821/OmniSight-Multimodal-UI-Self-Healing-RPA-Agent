"""Health check endpoint."""

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.db.session import check_db_connection

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    summary="Application & database health check",
    response_description="Status of the API and its database connection",
)
def health_check() -> JSONResponse:
    """
    Returns HTTP 200 when the API is running **and** the database is reachable.
    Returns HTTP 503 when the database cannot be reached.

    The response body always includes structured status information so
    monitoring tools can parse it without relying on HTTP status codes alone.
    """
    db_ok = check_db_connection()

    body = {
        "api": "ok",
        "database": "ok" if db_ok else "unavailable",
        "service": "OmniSight API",
    }

    http_status = status.HTTP_200_OK if db_ok else status.HTTP_503_SERVICE_UNAVAILABLE
    return JSONResponse(content=body, status_code=http_status)
