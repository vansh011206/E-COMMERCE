import { io } from 'socket.io-client';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const isLocal = apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1');

// Only connect to socket on local backend. Vercel Serverless doesn't support it.
const socket = isLocal ? io(apiUrl, {
  autoConnect: false,
  withCredentials: true
}) : {
  connect: () => {},
  disconnect: () => {},
  on: () => {},
  off: () => {},
  emit: () => {}
};

export default socket;
