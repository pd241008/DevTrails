"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CloudRain, Zap, TrendingUp, AlertTriangle, Cloud } from "lucide-react";
import axios from "axios";

interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: { text: string; icon: string };
    daily_chance_of_rain: number;
  };
}

export default function ForecastTab({ city = "Mumbai" }: { city?: string }) {
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await axios.get(`/api/forecast?city=${city}`);
        setForecast(res.data.forecast.forecastday);
      } catch (err) {
        console.error("Forecast error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForecast();
  }, [city]);

  const calculateRiskMultiplier = (chanceOfRain: number) => {
    if (chanceOfRain > 80) return 1.45;
    if (chanceOfRain > 50) return 1.25;
    return 1.0;
  };

  if (loading) return <div className="p-12 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Analyzing Atmospheric Probabilities...</div>;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-3">
        {forecast.map((day, i) => {
          const multiplier = calculateRiskMultiplier(day.day.daily_chance_of_rain);
          const isHighRisk = multiplier > 1.2;

          return (
            <motion.div 
              key={day.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`premium-card p-6 border-b-4 ${isHighRisk ? "border-b-indigo-500" : "border-b-emerald-500"}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
                {isHighRisk && <AlertTriangle className="h-4 w-4 text-indigo-400" />}
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                 <img src={day.day.condition.icon} alt={day.day.condition.text} className="h-12 w-12" />
                 <div>
                    <div className="text-xl font-black text-white tracking-tight">{Math.round(day.day.maxtemp_c)}°C</div>
                    <div className="text-[10px] font-medium text-zinc-500 uppercase">{day.day.condition.text}</div>
                 </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-800">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Precipitation</span>
                    <span className="text-xs font-bold text-white">{day.day.daily_chance_of_rain}%</span>
                 </div>
                 <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/50 border border-zinc-800">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`h-3 w-3 ${isHighRisk ? "text-indigo-400" : "text-emerald-400"}`} />
                        <span className="text-[9px] font-bold uppercase text-zinc-500">Auto-Premium</span>
                    </div>
                    <span className={`text-xs font-black ${isHighRisk ? "text-indigo-400" : "text-emerald-400"}`}>
                        x{multiplier}
                    </span>
                 </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="premium-card p-8 bg-indigo-500/5 border-indigo-500/20">
         <div className="flex items-center gap-4 mb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-500 flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white tracking-tight">AI Predictive Pricing Active</h3>
                <p className="text-xs text-zinc-500 font-medium">Underwriting model ensemble V1 is projecting surcharges for upcoming volatility.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
