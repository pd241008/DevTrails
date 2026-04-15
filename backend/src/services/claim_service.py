from src.schemas.claim import ClaimAssessmentRequest, ClaimAssessmentResponse
from src.services.fraud_service import FraudService
from src.services.payout_service import PayoutService

class ClaimService:
    # Thresholds for routing
    CONFIDENCE_THRESHOLD = 85.0
    PAYOUT_AMOUNT = 500.0 # Standard flat payout for demo disruptions (₹)

    @staticmethod
    def assess_claim(request: ClaimAssessmentRequest) -> ClaimAssessmentResponse:
        """
        Orchestrates the claim assessment with Fraud Detection and Instant Payouts.
        """
        # 1. Run GPS Velocity Check
        velocity_score = FraudService.check_gps_velocity(request.ping_history)
        
        # 2. Run Weather Verification
        weather_score = FraudService.verify_weather(
            request.lat, 
            request.lon, 
            request.timestamp, 
            request.weather_condition
        )
        
        # 3. Compute Combined Confidence Score
        # Simple weighted average for demo
        combined_score = (velocity_score * 0.4) + (weather_score * 0.6)
        
        status = "pending_review"
        routing_path = "Yellow Route"
        transaction_id = None
        message = f"Confidence score: {combined_score:.1f}% (Velocity: {velocity_score}%, Weather: {weather_score}%). "
        
        if combined_score >= ClaimService.CONFIDENCE_THRESHOLD:
            status = "approved"
            routing_path = "Green Route"
            
            # Trigger Instant Payout
            transaction_id = PayoutService.trigger_instant_payout(
                request.worker_id, 
                ClaimService.PAYOUT_AMOUNT
            )
            
            message += "Claim fast-tracked for instant payout via Stripe."
        else:
            message += "Claim flagged for manual verification due to low confidence."

        return ClaimAssessmentResponse(
            status=status,
            confidence_score=combined_score,
            routing_path=routing_path,
            transaction_id=transaction_id,
            message=message
        )
