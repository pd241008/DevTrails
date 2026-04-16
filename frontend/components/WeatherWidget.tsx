"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, Sun, Wind, Thermometer, AlertTriangle, RefreshCw } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    feelslike_c: number;
  };
}

export default function WeatherWidget({ city = "Mumbai", onRiskChange }: { city?: string; onRiskChange?: (risk: boolean) => void }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/weather?city=${city}`);
      setWeather(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || "Error connecting to weather service");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const getWeatherIcon = (text: string) => {
    const condition = text.toLowerCase();
    if (condition.includes("rain") || condition.includes("shower") || condition.includes("drizzle") || condition.includes("storm")) {
      return <CloudRain className="h-8 w-8 text-indigo-400" />;
    }
    if (condition.includes("cloud") || condition.includes("overcast") || condition.includes("mist")) {
      return <Cloud className="h-8 w-8 text-zinc-400" />;
    }
    return <Sun className="h-8 w-8 text-amber-400" />;
  };

  const isHighRisk = weather && (
    weather.current.condition.text.toLowerCase().includes("rain") || 
    weather.current.temp_c > 40 ||
    weather.current.wind_kph > 20
  );

  useEffect(() => {
    if (weather && onRiskChange) {
      onRiskChange(!!isHighRisk);
    }
  }, [isHighRisk, onRiskChange]);

  if (loading && !weather) {
    return (
      <div className="premium-card p-6 flex items-center justify-center min-h-[160px] animate-pulse">
        <RefreshCw className="h-6 w-6 text-zinc-700 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card p-6 border-rose-500/20 bg-rose-500/5 min-h-[160px] flex flex-col items-center justify-center text-center">
        <AlertTriangle className="h-8 w-8 text-rose-500 mb-2" />
        <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-tight">
          System Alert: Weather Core Offline
        </p>
        <p className="text-[9px] text-rose-500/60 mt-1 uppercase tracking-tighter">{error}</p>
        <button 
          onClick={fetchWeather}
          className="mt-4 px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold text-rose-400 hover:bg-rose-500/20 transition-all uppercase tracking-widest"
        >
          Re-initialize
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`premium-card p-6 relative overflow-hidden group transition-all duration-500 ${isHighRisk ? "border-indigo-500/30" : ""}`}
    >
      {/* Decorative ambient light */}
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full blur-[80px] opacity-20 transition-colors duration-1000 ${isHighRisk ? "bg-indigo-500" : "bg-emerald-500"}`}></div>

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center backdrop-blur-xl group-hover:border-zinc-700 transition-colors">
            {weather && getWeatherIcon(weather.current.condition.text)}
          </div>
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">Atmospheric Node</h3>
            <p className="text-sm font-black text-white tracking-tight uppercase">{weather?.location.name}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border transition-all ${isHighRisk ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
          {isHighRisk ? "Risk: Elevated" : "Risk: Nominal"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center text-zinc-500">
            <Thermometer className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Thermal</div>
            <div className="text-xl font-black text-white tracking-tighter">{Math.round(weather?.current.temp_c || 0)}°C</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-zinc-900/30 border border-zinc-800/50 flex items-center justify-center text-zinc-500">
            <Wind className="h-4 w-4" />
          </div>
          <div>
            <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-tighter">Velocity</div>
            <div className="text-xl font-black text-white tracking-tighter">{Math.round(weather?.current.wind_kph || 0)} <span className="text-[10px] font-medium opacity-40">kph</span></div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-zinc-800/50 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Real-time WeatherAPI.com Feed</span>
        </div>
        <button 
          onClick={fetchWeather}
          className="p-1 text-zinc-600 hover:text-indigo-400 transition-colors"
          title="Refresh Feed"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>
    </motion.div>
  );
}
