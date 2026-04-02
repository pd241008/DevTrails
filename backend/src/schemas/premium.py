from pydantic import BaseModel, Field
from typing import Optional

class PremiumCalculationRequest(BaseModel):
    zone: str = Field(..., description="Geographic zone identifier (e.g., 'zone-a', 'zone-b')")
    weather_condition: str = Field("clear", description="Current weather (e.g., 'clear', 'rain', 'extreme_heat')")
    traffic_level: str = Field("normal", description="Traffic condition (e.g., 'low', 'normal', 'heavy')")
    past_incidents: int = Field(0, ge=0, description="Number of past incidents for the worker")

class PremiumCalculationResponse(BaseModel):
    base_premium: float = Field(..., description="The standard weekly premium (₹)")
    risk_adjustment: float = Field(..., description="Positive or negative adjustment based on risk factors (₹)")
    final_premium: float = Field(..., description="The net premium to be paid (₹)")
    discount_applied: bool = Field(False, description="Whether a low-risk discount was applied")
    reasoning: str = Field(..., description="Explanation of the premium calculation")
