import Ably from 'ably';

let ablyClient = null;

const getAbly = () => {
  if (!ablyClient) {
    const key = process.env.ABLY_API_KEY;
    if (!key) {
      console.warn('⚠️ ABLY_API_KEY not set. Real-time notifications disabled.');
      return null;
    }
    ablyClient = new Ably.Rest(key);
  }
  return ablyClient;
};

/**
 * Publish an event to an Ably channel
 * @param {string} channelName - e.g. 'admin-notifications'
 * @param {string} eventName - e.g. 'new_order'
 * @param {object} data - payload to send
 */
export const publishEvent = async (channelName, eventName, data) => {
  try {
    const ably = getAbly();
    if (!ably) return;

    const channel = ably.channels.get(channelName);
    await channel.publish(eventName, data);
    console.log(`📡 Ably: Published "${eventName}" to "${channelName}"`);
  } catch (error) {
    console.error('❌ Ably publish error:', error.message);
  }
};

export default getAbly;
