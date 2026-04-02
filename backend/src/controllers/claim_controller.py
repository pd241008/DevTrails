from src.schemas.claim import ClaimAssessmentRequest, ClaimAssessmentResponse
from src.services.claim_service import ClaimService

class ClaimController:
    @staticmethod
    def assess(request: ClaimAssessmentRequest) -> ClaimAssessmentResponse:
        return ClaimService.assess_claim(request)
