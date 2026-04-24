"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityData {
  date: string;
  hours: number;
}

export default function ActivityChart({ data }: { data: ActivityData[] }) {
  // Sort data by date
  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="h-[200px] w-full bg-card border border-border rounded-[10px] p-4 shadow-sm overflow-hidden">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Activity (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={sortedData}>
          <defs>
            <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7C6FE0" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#7C6FE0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6B6A78', fontSize: 10 }}
            tickFormatter={(str) => {
              const date = new Date(str);
              return date.toLocaleDateString('en-US', { weekday: 'short' });
            }}
          />
          <YAxis 
            hide={true}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#111118] border border-border p-2 rounded shadow-lg text-xs">
                    <p className="font-semibold">{new Date(payload[0].payload.date).toLocaleDateString()}</p>
                    <p className="text-primary">{payload[0].value} hours</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="hours"
            stroke="#7C6FE0"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorHours)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
