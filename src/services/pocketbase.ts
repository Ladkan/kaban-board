import PocketBase from 'pocketbase';

export const client = new PocketBase(import.meta.env.VITE_PB_URL)

