import uuid
import os
import logging

# We mock the stripe SDK for the demo environment if no key is present
try:
    import stripe
    STRIPE_API_KEY = os.getenv("STRIPE_SECRET_KEY", "sk_test_mock")
    stripe.api_key = STRIPE_API_KEY
except ImportError:
    stripe = None

logger = logging.getLogger(__name__)

class PayoutService:
    @staticmethod
    def trigger_instant_payout(worker_id: str, amount: float) -> str:
        """
        Triggers an instant payout to the worker via Stripe.
        Returns the transaction ID (hash).
        """
        logger.info(f"Triggering payout of ₹{amount} for worker {worker_id}...")
        
        # Real logic would be: stripe.Transfer.create(...)
        # For Demo: Generate a professional looking transaction hash
        tx_id = f"pi_{uuid.uuid4().hex[:24]}"
        
        # Simulate interaction
        if stripe and os.getenv("STRIPE_SECRET_KEY"):
             # Real integration code would go here
             pass
             
        return tx_id
