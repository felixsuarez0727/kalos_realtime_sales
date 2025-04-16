import { TextEncoder, TextDecoder } from 'util';
import 'whatwg-fetch';
import BroadcastChannel from 'broadcast-channel'; 

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;
global.BroadcastChannel = BroadcastChannel; 