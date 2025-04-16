import { fetch, Request, Response, Headers } from 'undici';

globalThis.fetch = fetch;
globalThis.Request = Request;
globalThis.Response = Response;
globalThis.Headers = Headers;

process.env.NODE_ENV = 'test';