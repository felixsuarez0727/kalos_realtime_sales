import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';

import { RevenueCard } from '../RevenueCard';
import { rest } from 'msw';
import { setupServer } from 'msw/node'; 


const server = setupServer(
  rest.get('http://localhost:3001/transactions', (req, res, ctx) => {
    return res(ctx.json({ total: 123.45 }));
  })
);


const mockWebSocket = {
  onmessage: jest.fn(),
  close: jest.fn(),
};
global.WebSocket = jest.fn(() => mockWebSocket as unknown as WebSocket);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  jest.clearAllMocks();
});
afterAll(() => server.close());

describe('RevenueCard', () => {
  it('It should render initial text', () => {
    render(<RevenueCard />);
    expect(screen.getByText('Total Revenue: $0.00')).toBeInTheDocument();
  });

  it('It should load and show intial revenue from API', async () => {
    render(<RevenueCard />);
    await waitFor(() => screen.getByText('Total Revenue: $123.45'));
  });

  it('It should update revenue after a new message from WebSocket', async () => { // <- Aquí está el cambio: añadí 'async'
    render(<RevenueCard />);

     
    const wsCallback = (WebSocket as jest.Mock).mock.calls[0][0];
    const mockEvent = { data: JSON.stringify({ type: 'REVENUE_UPDATE', total: 567.89 }) } as MessageEvent;

    act(() => {
      mockWebSocket.onmessage(mockEvent);
    });

    await waitFor(() => screen.getByText('Total Revenue: $567.89'));  
  });

  it('It should close connection with WebSocket after unmount', () => {
    const { unmount } = render(<RevenueCard />);
    unmount();
    expect(mockWebSocket.close).toHaveBeenCalledTimes(1);
  });
});