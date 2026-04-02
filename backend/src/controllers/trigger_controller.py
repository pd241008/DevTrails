from src.schemas.trigger import TriggerSimulationRequest, TriggerSimulationResponse
from src.services.trigger_service import TriggerService

class TriggerController:
    @staticmethod
    def simulate(request: TriggerSimulationRequest) -> TriggerSimulationResponse:
        return TriggerService.simulate_trigger(request)
