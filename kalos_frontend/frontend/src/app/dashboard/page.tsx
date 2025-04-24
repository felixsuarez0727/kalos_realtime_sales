'use client';

import { useEffect, useState } from 'react';

type Transaction = {
  date: string;
  customerName: string;
  amount: number;
  currency: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [filter, setFilter] = useState('');

  // Formulario
  const [customerName, setCustomerName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');

  const apiUrl = window.location.hostname+':3001';
  const wsUrl = window.location.hostname+':8787';

  // Cargar transacciones iniciales
  useEffect(() => {
    fetch(`${apiUrl}/transactions`)
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        setTransactions(data);
        const total = data.reduce((sum, tx) => sum + tx.amount, 0);
        setRevenue(total);
      });
  }, []);

  // WebSocket
  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === 'new_transaction') {
        const { data, totalRevenue } = message;

        const newTransaction: Transaction = {
          customerName: data.customerName,
          amount: data.amount,
          currency: data.currency,
          date: new Date().toISOString(),
        };

        setTransactions((prev) => [newTransaction, ...prev]);
        setRevenue(totalRevenue);
      }
    };

    return () => ws.close();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const transaction = {
      customerName,
      amount: Number(amount),
      currency,
    };

    try {
      const res = 
      //await fetch('http://localhost:3001/transactions', {
      await fetch(`${apiUrl}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });

      if (res.ok) {
        setCustomerName('');
        setAmount('');
        setCurrency('USD');
      } else {
        const error = await res.text();
        alert(`Error: ${error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Hubo un error al enviar la transacción.');
    }
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.customerName.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Real-Time Sales Dashboard</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-10 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Add New Transaction</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Customer Name"
            className="border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            placeholder="Amount"
            className="border border-gray-300 rounded px-4 py-2"
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            <option value="USD">USD</option>
            <option value="CRC">CRC</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </form>

      {/* Filtros y resumen */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <input
          type="text"
          placeholder="Filter by customer name"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
        />

        <div className="text-right">
          <span className="text-lg font-semibold">Total Revenue:</span>
          <span className="text-xl font-bold text-green-600 ml-2">
            ${revenue.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto shadow border rounded">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold">
              <th className="px-4 py-2 border-b">Date</th>
              <th className="px-4 py-2 border-b">Customer Name</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Currency</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr key={index} className="text-sm hover:bg-gray-50">
                <td className="px-4 py-2 border-b">
                  {new Date(tx.date).toLocaleString()}
                </td>
                <td className="px-4 py-2 border-b">{tx.customerName}</td>
                <td className="px-4 py-2 border-b">${tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2 border-b">{tx.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
