from src.schemas.claim import ClaimAssessmentRequest, ClaimAssessmentResponse

class ClaimService:
    GREEN_ROUTE_THRESHOLD = 80.0

    @staticmethod
    def assess_claim(request: ClaimAssessmentRequest) -> ClaimAssessmentResponse:
        """
        Implements the Fast Path Routing Logic.
        """
        if request.evidence_score >= ClaimService.GREEN_ROUTE_THRESHOLD:
            return ClaimAssessmentResponse(
                status="approved",
                routing_path="Green Route",
                message=f"Claim fast-tracked for instant payout. High trust score ({request.evidence_score}/100)."
            )
        else:
            return ClaimAssessmentResponse(
                status="pending_review",
                routing_path="Yellow Route",
                message=f"Claim flagged for Step-Up Challenge. Low trust/evidence score ({request.evidence_score}/100) triggered mitigation protocol."
            )
