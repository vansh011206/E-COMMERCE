// Websockets disabled for Vercel Serverless compatibility
const socket = {
  connect: () => {},
  emit: () => {},
  on: () => {},
  off: () => {},
  connected: false
};
export default socket;
