// Custom tooltip for area chart
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const d = new Date(label);
    const dateStr = `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
    const point = payload[0].payload;
    return (
      <div style={{ background: '#fff', border: '1px solid #90caf9', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{dateStr}</div>
        <div>Business Value: <b>₹{formatINR(point.value)}</b></div>
        <div>Invested: <b>₹{formatINR(point.invested)}</b></div>
        <div>Profit: <b>₹{formatINR(point.profit)}</b></div>
        <div>Loss: <b>₹{formatINR(point.loss)}</b></div>
      </div>
    );
  }
  return null;
}
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatINR } from '../utils/formatINR';

// Utility to generate area chart data for business performance
export function getBusinessPerformanceData(investments) {
  // Sort by date ascending
  const sorted = [...investments].sort((a, b) => new Date(a.date) - new Date(b.date));
  // Group by date
  const dateMap = {};
  sorted.forEach((t) => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { date: t.date, invested: 0, profit: 0, loss: 0 };
    }
    if (t.type === 'invest') dateMap[t.date].invested += t.amount;
    if (t.type === 'profit') dateMap[t.date].profit += t.amount;
    if (t.type === 'loss') dateMap[t.date].loss += t.amount;
  });
  // Build cumulative value for each date
  let cumulativeInvested = 0;
  let cumulativeProfit = 0;
  let cumulativeLoss = 0;
  const result = [];
  Object.values(dateMap)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((d) => {
      cumulativeInvested += d.invested;
      cumulativeProfit += d.profit;
      cumulativeLoss += d.loss;
      const value = cumulativeInvested + cumulativeProfit - cumulativeLoss;
      result.push({
        date: d.date,
        value,
        invested: cumulativeInvested,
        profit: cumulativeProfit,
        loss: cumulativeLoss,
      });
    });
  return result;
}

export default function BusinessPerformanceAreaChart({ data }) {
  // Determine color: green if current value >= invested, else red
  const last = data[data.length - 1];
  const color = last && last.value >= last.invested ? '#2e7d32' : '#d32f2f';
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        {/* <XAxis
          dataKey="date"
          tickFormatter={(dateStr) => {
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' })}`;
          }}
        /> */}
        {/* <YAxis
          tickFormatter={formatINR}
        /> */}
        <Tooltip content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
                console.log(label, payload);
                const point = payload[0].payload;
                const d = new Date(point.date);
                const dateStr = `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
                
                return (
                <div style={{background: '#fff', border: '1px solid #90caf9', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontWeight: 700, marginBottom: 4, color: '#0288d1'  }}>{dateStr}</div>
                    <div style={{ color: color, marginBottom: 4 }}>Business Value: <b>₹{formatINR(point.value)}</b></div>
                    <div style={{ color: '#1976d2', marginBottom: 4 }}>Invested: <b>₹{formatINR(point.invested)}</b></div>
                    <div style={{ color: '#2e7d32', marginBottom: 4 }}>Profit: <b>₹{formatINR(point.profit)}</b></div>
                    <div style={{ color: '#d32f2f', marginBottom: 4 }}>Loss: <b>₹{formatINR(point.loss)}</b></div>
                </div>
                );
            }
            return null;
        }}/>
        <defs>
          <linearGradient id="businessValueColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.7}/>
            <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="value"
          name="Business Value"
          stroke={color}
          fill="url(#businessValueColor)"
          fillOpacity={1}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
