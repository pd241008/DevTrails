from pydantic import BaseModel, Field
from typing import List, Optional

class GPSPing(BaseModel):
    lat: float
    lon: float
    timestamp: str

class ClaimAssessmentRequest(BaseModel):
    claim_id: str = Field(..., description="Unique identifier for the claim")
    worker_id: str = Field(..., description="Identifier for the claimant worker")
    lat: float = Field(..., description="Latitude of the claim event")
    lon: float = Field(..., description="Longitude of the claim event")
    timestamp: str = Field(..., description="ISO timestamp of the event")
    weather_condition: str = Field(..., description="Reported weather condition (e.g., 'heavy_rain')")
    ping_history: List[GPSPing] = Field(default=[], description="Recent GPS ping history for velocity check")
    evidence_score: float = Field(default=0.0, ge=0, le=100, description="Trust/Evidence score computed from past history and ML assessment (0-100)")

class ClaimAssessmentResponse(BaseModel):
    status: str = Field(..., description="Current status of the claim (e.g., 'approved', 'rejected', 'pending_review')")
    confidence_score: float = Field(..., description="Combined confidence score from fraud/weather checks")
    routing_path: str = Field(..., description="The route taken: 'Green Route' or 'Yellow Route'")
    transaction_id: Optional[str] = Field(None, description="Stripe transaction hash if payout was triggered")
    message: str = Field(..., description="Details regarding the assessment outcome")

class ManualClaimSubmission(BaseModel):
    worker_id: str
    description: str
    image_b64: str
    amount: float = 500.0
