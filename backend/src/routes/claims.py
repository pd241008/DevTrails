from fastapi import APIRouter
from src.schemas.claim import ClaimAssessmentRequest, ClaimAssessmentResponse
from src.controllers.claim_controller import ClaimController

router = APIRouter()

@router.post("/assess_claim", response_model=ClaimAssessmentResponse)
def assess_claim(request: ClaimAssessmentRequest):
    """
    Fast Path Routing Logic:
    Assess claims to route to "Green Route" (instant payout) or "Yellow Route" (flagged).
    """
    return ClaimController.assess(request)
