import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'Mumbai';
  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey || apiKey === 'your_openweathermap_api_key_here') {
    return NextResponse.json(
      { error: 'Weather API Key not configured' },
      { status: 500 }
    );
  }

  try {
    // Fetch 3-day forecast
    const response = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3&aqi=no&alerts=yes`
    );
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Forecast API Error:', error.response?.data || error.message);
    
    // DEMO FALLBACK: If API key is invalid or fails, return simulated forecast
    if (error.response?.status === 401 || error.response?.status === 403 || !apiKey) {
      return NextResponse.json({
        location: { name: city, region: "Simulation", country: "ShiftSafeguard Core" },
        current: { temp_c: 28, condition: { text: "Cloudy" } },
        forecast: {
          forecastday: [
            {
              date: new Date().toISOString().split('T')[0],
              day: { maxtemp_c: 32, mintemp_c: 24, condition: { text: "Heavy Rain [Simulated]", icon: "//cdn.weatherapi.com/weather/64x64/day/308.png" }, daily_chance_of_rain: 85 }
            },
            {
              date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              day: { maxtemp_c: 31, mintemp_c: 23, condition: { text: "Thunderstorm [Simulated]", icon: "//cdn.weatherapi.com/weather/64x64/day/389.png" }, daily_chance_of_rain: 92 }
            },
            {
              date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
              day: { maxtemp_c: 33, mintemp_c: 25, condition: { text: "Partly Cloudy [Simulated]", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png" }, daily_chance_of_rain: 15 }
            }
          ]
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch forecast data' },
      { status: error.response?.status || 500 }
    );
  }
}
