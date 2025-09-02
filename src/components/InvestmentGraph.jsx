import React from 'react';
import { LineChart,AreaChart , Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, Area } from 'recharts';

export default function InvestmentGraph({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
        {/* <XAxis
          dataKey="date"
          tickFormatter={(dateStr) => {
            const d = new Date(dateStr);
            return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short' })}`;
          }}
        /> */}
        {/* <YAxis
          tickFormatter={(value) => {
            if (value >= 100000) return `${(value / 100000).toFixed(2)}L`;
            if (value >= 1000) return `${(value / 1000).toFixed(2)}K`;
            return value;
          }}
        /> */}
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              const invested = payload.find(p => p.dataKey === 'invested');
              const received = payload.find(p => p.dataKey === 'received');
              return (
                <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: 8, padding: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6, color: '#0288d1' }}>
                    {(() => {
                      const d = new Date(label);
                      return `${d.getDate().toString().padStart(2, '0')} ${d.toLocaleString('en-US', { month: 'short', year: 'numeric' })}`;
                    })()}
                  </div>
                  <div style={{ color: '#1976d2', marginBottom: 4 }}>
                    Invested: <b>₹{invested ? invested.value : 0}</b>
                  </div>
                  <div style={{ color: '#2e7d32' }}>
                    Received: <b>₹{received ? received.value : 0}</b>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <defs>
          <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1976d2" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#1976d2" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorReceived" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.7}/>
            <stop offset="95%" stopColor="#2e7d32" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="invested"
          name="Invested"
          stroke="#1976d2"
          fill="url(#colorInvested)"
          fillOpacity={1}
          activeDot={{ r: 5 }}
        />
        <Area
          type="monotone"
          dataKey="received"
          name="Received"
          stroke="#2e7d32"
          fill="url(#colorReceived)"
          fillOpacity={1}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
