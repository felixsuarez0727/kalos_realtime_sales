'use client';
import React from 'react';
import { useEffect, useState } from 'react';

export function RevenueCard() {
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const apiUrl = window.location.hostname+':3001';
    const wsUrl = window.location.hostname+':8787';

    fetch(`${apiUrl}/transactions`)
    .then(res => res.json())
    .then(data => setRevenue(data.total));

    const ws = new WebSocket(wsUrl);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'REVENUE_UPDATE') {
        setRevenue(data.total);
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="bg-green-100 text-green-800 p-4 rounded shadow text-xl">
      Total Revenue: ${revenue.toFixed(2)}
    </div>
  );
}
