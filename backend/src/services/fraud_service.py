import time
from typing import List
from geopy.distance import geodesic
from src.schemas.claim import GPSPing

class FraudService:
    # Max speed for a delivery worker in km/h (e.g., fast bike/car in traffic)
    MAX_VELOCITY_KMPH = 100.0
    
    @staticmethod
    def check_gps_velocity(ping_history: List[GPSPing]) -> float:
        """
        Returns a confidence score (0-100) based on GPS velocity analysis.
        Low score means suspicious (spoofed) movement.
        """
        if len(ping_history) < 2:
            return 100.0 # Not enough data to flag
            
        anomalies = 0
        total_checks = 0
        
        for i in range(1, len(ping_history)):
            p1 = ping_history[i-1]
            p2 = ping_history[i]
            
            # Calculate distance in km
            dist = geodesic((p1.lat, p1.lon), (p2.lat, p2.lon)).km
            
            # Calculate time difference in hours
            try:
                # Assuming ISO strings, simplistic parse for demo
                t1 = time.mktime(time.strptime(p1.timestamp.split('.')[0], "%Y-%m-%dT%H:%M:%S"))
                t2 = time.mktime(time.strptime(p2.timestamp.split('.')[0], "%Y-%m-%dT%H:%M:%S"))
                time_diff = abs(t2 - t1) / 3600.0
            except Exception:
                continue
                
            if time_diff > 0:
                velocity = dist / time_diff
                if velocity > FraudService.MAX_VELOCITY_KMPH:
                    anomalies += 1
            
            total_checks += 1
            
        if total_checks == 0:
            return 100.0
            
        score = max(0, 100 - (anomalies / total_checks * 100 * 2))
        return float(score)

    @staticmethod
    def verify_weather(lat: float, lon: float, timestamp: str, reported_condition: str) -> float:
        """
        Mocks a cross-reference with a historical weather API (OpenWeatherMap).
        In a real app, this would perform an async API call.
        """
        # For Demo: If condition is 'heavy_rain', simulate a 95% match
        if reported_condition in ["heavy_rain", "storm", "flood"]:
            return 95.0
        return 70.0 # Default baseline trust
