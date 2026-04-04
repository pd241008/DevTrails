import joblib
import pandas as pd
import os
from src.schemas.premium import PremiumCalculationRequest, PremiumCalculationResponse

# Load model on startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "models", "premium_model.pkl")
model = None

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")

class PremiumService:
    @staticmethod
    def calculate_premium(request: PremiumCalculationRequest) -> PremiumCalculationResponse:
        """
        Calculates dynamic premiums using the Random Forest model.
        """
        # Base Prices (requested by user)
        BASE_PRICES = {
            "basic": 29.0,
            "standard": 59.0,
            "pro": 99.0
        }

        if model is None:
            # Fallback multiplier if model fails to load
            multiplier = 1.0
            message = "Premium calculated using baseline (Model unavailable)"
        else:
            # Prepare input data for the model
            input_data = pd.DataFrame([{
                "zone_risk_score": request.zone_risk_score,
                "season": request.season,
                "worker_tenure_months": request.worker_tenure_months,
                "clean_claim_history": request.clean_claim_history
            }])
            
            # Predict multiplier
            try:
                # Assuming model returns a multiplier or we can extract it from the prediction
                prediction = model.predict(input_data)
                multiplier = float(prediction[0])
            except Exception as e:
                print(f"Prediction error: {e}")
                multiplier = 1.0
            
            # Determine message based on multiplier
            if multiplier > 1.0:
                reason = "Monsoon/High-Risk Surcharge applied" if request.season == 2 else "Risk Factor adjustment"
                message = f"AI-Powered Pricing: {reason}"
            elif multiplier < 1.0:
                message = "AI-Powered Pricing: Low-Risk Discount applied!"
            else:
                message = "Standard AI rates applied."

        # Calculate final prices
        return PremiumCalculationResponse(
            basic=round(BASE_PRICES["basic"] * multiplier),
            standard=round(BASE_PRICES["standard"] * multiplier),
            pro=round(BASE_PRICES["pro"] * multiplier),
            multiplier=round(multiplier, 2),
            message=message
        )
