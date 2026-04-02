from src.schemas.trigger import TriggerSimulationRequest, TriggerSimulationResponse

class TriggerService:
    # Defined Thresholds for specific events
    THRESHOLDS = {
        "weather_heat": {"threshold": 44.0, "payout": 50.0, "unit": "°C"},
        "weather_rain": {"threshold": 15.0, "payout": 70.0, "unit": "mm/hr"},
        "system_outage": {"threshold": 30.0, "payout": 100.0, "unit": "mins"},
        "traffic_spike": {"threshold": 2.5, "payout": 40.0, "unit": "x standard delay"}
    }

    @staticmethod
    def simulate_trigger(request: TriggerSimulationRequest) -> TriggerSimulationResponse:
        """
        Simulates an oracle checking real-world parametric data thresholds.
        """
        event = request.event_type.lower()
        if event not in TriggerService.THRESHOLDS:
            return TriggerSimulationResponse(
                event_type=event,
                threshold_breached=False,
                simulated_data=f"Unknown event type: {event}. No threshold available.",
                payout_amount=0.0
            )

        rules = TriggerService.THRESHOLDS[event]
        threshold = rules["threshold"]
        payout = rules["payout"]
        unit = rules["unit"]

        breached = request.current_value >= threshold
        
        if breached:
            simulated_data = f"Oracle Alert: {request.current_value}{unit} breached threshold of {threshold}{unit}."
            final_payout = payout
        else:
            simulated_data = f"Normal Range: {request.current_value}{unit} is below threshold of {threshold}{unit}."
            final_payout = 0.0

        return TriggerSimulationResponse(
            event_type=event,
            threshold_breached=breached,
            simulated_data=simulated_data,
            payout_amount=final_payout
        )
