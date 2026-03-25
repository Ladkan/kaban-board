import type { AuthRecord } from "pocketbase";
import { create } from "zustand";
import { client } from "../services/pocketbase";
import { persist } from "zustand/middleware";

interface AuthStore {
    user: AuthRecord | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: client.authStore.model,
            isAuthenticated: client.authStore.isValid,

            login: async (email, password) => {
                try {
                    const { record } = await client.collection('users').authWithPassword(email, password)
                    set({ user: record, isAuthenticated: true })
                } catch (err) {
                    console.error("Login failed:", err);
                    throw err;
                }
            },

            register: async (name, email, password) => {
                try {
                    await client.collection('users').create({ name, email, password, passwordConfirm: password })
                    const { record } = await client.collection('users').authWithPassword(email, password)
                    set({ user: record, isAuthenticated: true })
                } catch (err) {
                    console.error("Registration failed:", err);
                    throw err;
                }
            },
            
            logout: () => {
                client.authStore.clear()
                set({ user: null, isAuthenticated: false})
            },

        }),
        { name: "auth-store"}
    )
)