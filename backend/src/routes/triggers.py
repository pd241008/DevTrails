from fastapi import APIRouter
from src.schemas.trigger import TriggerSimulationRequest, TriggerSimulationResponse
from src.controllers.trigger_controller import TriggerController

router = APIRouter()

@router.post("/simulate_trigger", response_model=TriggerSimulationResponse)
def simulate_trigger(request: TriggerSimulationRequest):
    """
    Trigger Simulation Endpoint:
    Simulates parametric events (disruptions) crossing a threshold.
    """
    return TriggerController.simulate(request)
