import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TextEncoder, TextDecoder } from 'util';
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

class BroadcastChannelMock {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  postMessage = jest.fn();
  close = jest.fn();
  onmessage = null;
}

(global as any).BroadcastChannel = BroadcastChannelMock;