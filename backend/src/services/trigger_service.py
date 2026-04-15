from src.schemas.trigger import TriggerSimulationRequest, TriggerSimulationResponse
from src.schemas.claim import ClaimAssessmentRequest, GPSPing
from src.services.claim_service import ClaimService
import datetime
import random

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
        If demo_mode is True, it also fires claims for mock workers.
        """
        event = request.event_type.lower()
        rules = TriggerService.THRESHOLDS.get(event, {"threshold": 10.0, "payout": 50.0, "unit": "units"})
        
        threshold = rules["threshold"]
        payout = rules["payout"]
        unit = rules["unit"]

        breached = request.current_value >= threshold
        
        results = []
        if breached and request.demo_mode:
            # Simulate 5 workers within the geofence
            for i in range(1, 6):
                worker_id = f"WKR_{1000 + i}"
                # Generate realistic GPS pings
                pings = [
                    GPSPing(lat=19.076 + (random.random() * 0.01), lon=72.877 + (random.random() * 0.01), timestamp=(datetime.datetime.now() - datetime.timedelta(minutes=j*10)).isoformat())
                    for j in range(5, 0, -1)
                ]
                
                claim_req = ClaimAssessmentRequest(
                    claim_id=f"CLM_{datetime.datetime.now().strftime('%Y%m%d%H%M')}_{i}",
                    worker_id=worker_id,
                    lat=19.076,
                    lon=72.877,
                    timestamp=datetime.datetime.now().isoformat(),
                    weather_condition=event,
                    ping_history=pings,
                    evidence_score=90.0 # High baseline for demo success
                )
                
                # Push through pipeline
                res = ClaimService.assess_claim(claim_req)
                results.append(f"{worker_id}: {res.status} (TX: {res.transaction_id})")

        if breached:
            simulated_data = f"Oracle Alert: {request.current_value}{unit} breached threshold. "
            if request.demo_mode:
                simulated_data += f"Batch Assessment complete: {', '.join(results[:2])}..."
            final_payout = payout
        else:
            simulated_data = f"Normal Range: {request.current_value}{unit} is below threshold."
            final_payout = 0.0

        return TriggerSimulationResponse(
            event_type=event,
            threshold_breached=breached,
            simulated_data=simulated_data,
            payout_amount=final_payout
        )
