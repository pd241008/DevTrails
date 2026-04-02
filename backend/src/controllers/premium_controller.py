from src.schemas.premium import PremiumCalculationRequest, PremiumCalculationResponse
from src.services.premium_service import PremiumService

class PremiumController:
    @staticmethod
    def calculate(request: PremiumCalculationRequest) -> PremiumCalculationResponse:
        return PremiumService.calculate_premium(request)
