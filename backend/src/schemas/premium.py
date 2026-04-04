from pydantic import BaseModel, Field
from typing import Dict, Any

class PremiumCalculationRequest(BaseModel):
    zone_risk_score: int = Field(..., ge=1, le=10, description="Risk score for the zone (1-10)")
    season: int = Field(..., ge=1, le=4, description="Season (1: Summer, 2: Monsoon, 3: Winter, 4: Spring)")
    worker_tenure_months: int = Field(..., ge=0, description="Months of worker experience")
    clean_claim_history: int = Field(..., ge=0, le=1, description="1 if no past claims, 0 otherwise")

class PremiumCalculationResponse(BaseModel):
    basic: float = Field(..., description="Adjusted price for Basic tier (₹)")
    standard: float = Field(..., description="Adjusted price for Standard tier (₹)")
    pro: float = Field(..., description="Adjusted price for Pro tier (₹)")
    multiplier: float = Field(..., description="The AI-calculated risk multiplier")
    message: str = Field(..., description="Explanation of the premium adjustment")
