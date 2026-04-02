from src.schemas.premium import PremiumCalculationRequest, PremiumCalculationResponse

class PremiumService:
    @staticmethod
    def calculate_premium(request: PremiumCalculationRequest) -> PremiumCalculationResponse:
        """
        Mock implementation of an XGBoost risk model for premium calculation.
        """
        base_premium = 50.0  # Base weekly premium ₹50

        risk_adjustment = 0.0
        reasoning_points = []
        discount_applied = False

        # Heuristic 1: Traffic Levels
        if request.traffic_level.lower() == "heavy":
            risk_adjustment += 10.0
            reasoning_points.append("High traffic congestion adds ₹10 risk.")
        elif request.traffic_level.lower() == "low":
            risk_adjustment -= 2.0
            reasoning_points.append("Low traffic gives ₹2 discount.")
            discount_applied = True

        # Heuristic 2: Weather Conditions
        weather = request.weather_condition.lower()
        if weather in ["rain", "storm", "extreme_heat"]:
            risk_adjustment += 15.0
            reasoning_points.append(f"Adverse weather ({weather}) adds ₹15 risk.")

        # Heuristic 3: Past Incidents
        if request.past_incidents > 0:
            penalty = min(request.past_incidents * 5.0, 20.0) # Cap penalty at ₹20
            risk_adjustment += penalty
            reasoning_points.append(f"{request.past_incidents} past incidents adds ₹{penalty} risk.")
            discount_applied = False # Negate discount if incidents exist

        # Heuristic 4: Zone risk (simulated)
        if "high-risk" in request.zone.lower():
            risk_adjustment += 8.0
            reasoning_points.append("Zone flagged as high-risk by historical data (+₹8).")
        elif "low-risk" in request.zone.lower() and discount_applied:
            risk_adjustment -= 5.0
            reasoning_points.append("Safe zone synergy gives extra ₹5 discount.")

        final_premium = max(base_premium + risk_adjustment, 15.0) # Hard floor at ₹15

        if not reasoning_points:
            reasoning_points.append("Standard risk factors, no adjustments.")

        return PremiumCalculationResponse(
            base_premium=base_premium,
            risk_adjustment=risk_adjustment,
            final_premium=final_premium,
            discount_applied=discount_applied,
            reasoning=" | ".join(reasoning_points)
        )
