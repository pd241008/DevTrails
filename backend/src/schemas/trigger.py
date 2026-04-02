from pydantic import BaseModel, Field
from typing import Optional, Any

class TriggerSimulationRequest(BaseModel):
    event_type: str = Field(..., description="Type of event (e.g., 'weather_heat', 'weather_rain', 'system_outage', 'traffic_spike')")
    current_value: float = Field(..., description="The numerical indicator of the event severity (e.g., Temperature, Rainfall mm/hr, Outage duration in mins)")

class TriggerSimulationResponse(BaseModel):
    event_type: str = Field(..., description="Type of event evaluated")
    threshold_breached: bool = Field(..., description="True if the event crossed the payout threshold")
    simulated_data: str = Field(..., description="Mocked summary from third-party oracle (e.g., 'API reported 44°C')")
    payout_amount: float = Field(0.0, description="Amount to be paid out if threshold is breached (₹)")
