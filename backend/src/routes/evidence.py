from fastapi import APIRouter, HTTPException
from src.schemas.claim import ManualClaimSubmission
from src.services.ensemble_claim_service import MultimodalEnsembleService

router = APIRouter()

@router.post("/process_evidence")
async def process_evidence(submission: ManualClaimSubmission):
    """
    Entry point for Multimodal Ensemble Evaluation.
    Processes captured image and text to return a confidence assessment.
    """
    try:
        assessment = MultimodalEnsembleService.evaluate_claim(
            submission.image_b64, 
            submission.description
        )
        return assessment
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
