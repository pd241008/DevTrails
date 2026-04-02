from fastapi import APIRouter
from src.controllers import health_controller

router = APIRouter()

@router.get("/")
def check_health():
    return health_controller.get_health_status()
