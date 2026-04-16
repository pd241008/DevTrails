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
    const response = await axios.get(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`
    );
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Weather API Error:', error.response?.data || error.message);
    
    // DEMO FALLBACK: If API key is invalid, disabled, or missing, return high-fidelity mock data
    if (error.response?.status === 401 || error.response?.status === 403 || !apiKey || apiKey === 'your_openweathermap_api_key_here') {
      console.log('Using Demo Fallback for Weather Data');
      return NextResponse.json({
        location: { name: city, region: "Simulation", country: "ShiftSafeguard Core" },
        current: {
          temp_c: 29,
          condition: { text: "Partly Cloudy [Simulated]", icon: "//cdn.weatherapi.com/weather/64x64/day/116.png", code: 1003 },
          wind_kph: 12.4,
          humidity: 65,
          feelslike_c: 31
        }
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch weather data' },
      { status: error.response?.status || 500 }
    );
  }
}
