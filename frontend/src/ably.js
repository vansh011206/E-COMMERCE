import Ably from 'ably';

const apiKey = import.meta.env.VITE_ABLY_API_KEY;

let ablyClient = null;

/**
 * Get or create a singleton Ably Realtime client
 */
export const getAbly = () => {
  if (!ablyClient && apiKey) {
    ablyClient = new Ably.Realtime({
      key: apiKey,
      autoConnect: true,
    });

    ablyClient.connection.on('connected', () => {
      console.log('✅ Ably connected');
    });

    ablyClient.connection.on('failed', (err) => {
      console.error('❌ Ably connection failed:', err);
    });
  }
  return ablyClient;
};

/**
 * Subscribe to a channel/event
 * @param {string} channelName 
 * @param {string} eventName 
 * @param {function} callback 
 * @returns {function} unsubscribe function
 */
export const subscribe = (channelName, eventName, callback) => {
  const ably = getAbly();
  if (!ably) {
    console.warn('Ably not available (no API key)');
    return () => {};
  }

  const channel = ably.channels.get(channelName);
  channel.subscribe(eventName, (message) => {
    callback(message.data);
  });

  return () => {
    channel.unsubscribe(eventName);
  };
};

export default { getAbly, subscribe };
