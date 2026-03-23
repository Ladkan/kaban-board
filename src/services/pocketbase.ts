import PocketBase from 'pocketbase';

export const client = new PocketBase(import.meta.env.VITE_PB_URL)
client.autoCancellation(false)
client.beforeSend = function(url, options) {
    options.headers = {
        ...options.headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
    };
    return { url, options }
}
