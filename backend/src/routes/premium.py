from fastapi import APIRouter
from src.schemas.premium import PremiumCalculationRequest, PremiumCalculationResponse
from src.controllers.premium_controller import PremiumController

router = APIRouter()

@router.post("/calculate_premium", response_model=PremiumCalculationResponse)
def calculate_premium(request: PremiumCalculationRequest):
    """
    Dynamic Premium Endpoint:
    Accepts the worker's zone and risk factors, and returns the dynamically adjusted weekly premium.
    """
    return PremiumController.calculate(request)
