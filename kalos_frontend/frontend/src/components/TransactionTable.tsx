'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: number;
  date: string;
  customer: string;
  amount: number;
  currency: string;
}

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/transactions')
      .then(res => res.json())
      .then(setTransactions);

    const ws = new WebSocket('ws://localhost:8787');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_TRANSACTION') {
        setTransactions(prev => [data.transaction, ...prev]);
      }
    };

    return () => ws.close();
  }, []);

  const filtered = transactions.filter(tx =>
    tx.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search by customer..."
        className="border rounded px-3 py-2 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tx) => (
            <tr key={tx.id}>
              <td className="p-2 border">{new Date(tx.date).toLocaleDateString()}</td>
              <td className="p-2 border">{tx.customer}</td>
              <td className="p-2 border">
                {tx.amount.toFixed(2)} {tx.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
