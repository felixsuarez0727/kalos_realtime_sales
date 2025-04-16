import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import { TransactionTable } from '../TransactionTable';
import { rest } from 'msw';
import { setupServer } from 'msw/node';


const mockTransactions = [
  { id: 1, date: '2025-04-16T10:00:00.000Z', customer: 'Alice', amount: 50.00, currency: 'USD' },
  { id: 2, date: '2025-04-15T14:30:00.000Z', customer: 'Bob', amount: 100.00, currency: 'EUR' },
];

const server = setupServer(
  rest.get('http://localhost:3001/transactions', (req, res, ctx) => {
    return res(ctx.json(mockTransactions));
  })
);

const mockWebSocketTable = {
  onmessage: jest.fn(),
  close: jest.fn(),
};
global.WebSocket = jest.fn(() => mockWebSocketTable as unknown as WebSocket);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

describe('TransactionTable', () => {
  it('It should render table headers', () => {
    render(<TransactionTable />);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('It should load and show initial transactions', async () => {
    render(<TransactionTable />);
    await waitFor(() => screen.getByText('Alice'));
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('50.00 USD')).toBeInTheDocument();
    expect(screen.getByText('100.00 EUR')).toBeInTheDocument();
  });

  it('It should add a new transaction when a new message comes from WebSocket', async () => { // <- Añadido 'async'
    render(<TransactionTable />);

    const newTransaction = { id: 3, date: '2025-04-17T09:00:00.000Z', customer: 'Charlie', amount: 75.00, currency: 'GBP' };
    const wsCallback = (WebSocket as jest.Mock).mock.calls[0][0];
    const mockEvent = { data: JSON.stringify({ type: 'NEW_TRANSACTION', transaction: newTransaction }) } as MessageEvent;

    act(() => { // <- Añadido act()
      mockWebSocketTable.onmessage(mockEvent);
    });

    await waitFor(() => screen.getByText('Charlie')); // <- Añadido await waitFor
    // La nueva transacción debería estar al principio
    await waitFor(() => expect(screen.getAllByText('Charlie')[0]).toBeInTheDocument()); // <- Añadido await waitFor
  });

  it('It should filter transactions by client name', async () => {
    render(<TransactionTable />);
    await waitFor(() => screen.getByText('Alice'));

    const searchInput = screen.getByPlaceholderText('Search by customer...');
    fireEvent.change(searchInput, { target: { value: 'ali' } });

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: '' } }); // Limpiar la búsqueda
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('It should close connection with WebSocket after unmount', () => {
    const { unmount } = render(<TransactionTable />);
    unmount();
    expect(mockWebSocketTable.close).toHaveBeenCalledTimes(1);
  });
});