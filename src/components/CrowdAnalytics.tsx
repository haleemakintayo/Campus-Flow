import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Info, Users, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { predictRushHour } from '@/services/geminiService';

const data = [
  { time: '07:00', occupancy: 20 },
  { time: '08:00', occupancy: 85 },
  { time: '09:00', occupancy: 95 },
  { time: '10:00', occupancy: 60 },
  { time: '11:00', occupancy: 45 },
  { time: '12:00', occupancy: 70 },
  { time: '13:00', occupancy: 75 },
  { time: '14:00', occupancy: 50 },
  { time: '15:00', occupancy: 55 },
  { time: '16:00', occupancy: 80 },
  { time: '17:00', occupancy: 90 },
  { time: '18:00', occupancy: 40 },
];

export default function CrowdAnalytics() {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const currentOccupancy = 88; // Mock current peak

  const handlePredict = async () => {
    setLoading(true);
    const result = await predictRushHour(data);
    setPrediction(result);
    setLoading(false);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">System Insights</h2>
        <Button 
          size="sm" 
          variant="outline" 
          className="gap-2 border-primary/50 text-primary hover:bg-primary/10 h-8 text-[10px] font-bold uppercase tracking-widest"
          onClick={handlePredict}
          disabled={loading}
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          AI Prediction
        </Button>
      </div>

      {prediction && (
        <div className="sleek-card bg-primary/5 border-primary/30 animate-in fade-in slide-in-from-top-4">
          <div className="pb-2 mb-2 border-b border-white/5">
            <div className="text-[11px] flex items-center gap-2 font-bold uppercase tracking-widest text-primary">
              <Sparkles className="w-3 h-3" />
              AI Rush-Hour Analysis
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider">{prediction.prediction}</span>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tighter border-primary/30 text-primary">
                {Math.round(prediction.confidence * 100)}% Confidence
              </Badge>
            </div>
            <div className="space-y-2">
              {prediction.strategies.map((strategy: string, i: number) => (
                <div key={i} className="flex gap-2 text-[11px] text-muted-foreground leading-relaxed">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  <span>{strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <div className="sleek-card">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="sleek-label mb-0">Current Load</span>
              <div className="text-xl font-bold tracking-tight">{currentOccupancy}%</div>
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full w-[88%]" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">High Demand Detected</p>
          </div>
        </div>
      </div>

      <div className="sleek-card">
        <span className="sleek-label">Occupancy Trends</span>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="occupancy" 
                stroke="var(--primary)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorOcc)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sleek-card bg-primary/5 border-primary/20 flex gap-4 items-start">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm">Smart Suggestion</h4>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Student Union stop is currently overcrowded. We suggest walking to the Library stop (4 min walk) to catch the South Loop bus which is 15% full.
          </p>
        </div>
      </div>
    </div>
  );
}
