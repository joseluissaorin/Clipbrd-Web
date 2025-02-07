'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function UsageChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => new Date(date).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip
          labelFormatter={(date) => new Date(date).toLocaleDateString()}
          formatter={(value) => [value, "Requests"]}
        />
        <Area
          type="monotone"
          dataKey="requests"
          stroke="#4f46e5"
          fill="#4f46e5"
          fillOpacity={0.1}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 