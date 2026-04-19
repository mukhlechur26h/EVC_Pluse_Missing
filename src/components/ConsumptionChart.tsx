import { CalculatedReading } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ConsumptionChartProps {
  readings: CalculatedReading[];
}

export function ConsumptionChart({ readings }: ConsumptionChartProps) {
  const chartData = readings.slice(1).map((r) => ({
    date: r.date,
    consumption: parseFloat(r.vbtConsumption.toFixed(2)),
    missing: r.pulseMissing > 0 ? parseFloat(r.pulseMissing.toFixed(2)) : 0,
    gain: r.pulseMissing < 0 ? parseFloat(Math.abs(r.pulseMissing).toFixed(2)) : 0,
  }));

  if (chartData.length === 0) return null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">ব্যবহারের প্রবণতা (Consumption Trend)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Line
                type="monotone"
                dataKey="consumption"
                name="মূল ব্যবহার (VbT)"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="missing"
                name="পালস মিসিং (Unit)"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="gain"
                name="পালস গেইন (Unit)"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
