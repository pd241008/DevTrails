from pydantic import BaseModel, Field

class ClaimAssessmentRequest(BaseModel):
    claim_id: str = Field(..., description="Unique identifier for the claim")
    worker_id: str = Field(..., description="Identifier for the claimant worker")
    evidence_score: float = Field(..., ge=0, le=100, description="Trust/Evidence score computed from past history and ML assessment (0-100)")

class ClaimAssessmentResponse(BaseModel):
    status: str = Field(..., description="Current status of the claim (e.g., 'approved', 'pending_review')")
    routing_path: str = Field(..., description="The route taken: 'Green Route' or 'Yellow Route'")
    message: str = Field(..., description="Details regarding the assessment outcome")
