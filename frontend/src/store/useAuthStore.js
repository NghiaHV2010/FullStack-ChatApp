import { create } from "zustand";
import { axiosConfig } from "../config/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE = "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const response = await axiosConfig.get("/auth/check");
            // console.log("rs", response);

            set({ authUser: response.data.data });
            get().connectSocket();
        } catch (error) {
            console.error("Auth error: ", error.response.data);

            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosConfig.post("/auth/signup", data);
            set({ authUser: response.data });
            toast.success("Account created successfully!");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    logout: async () => {
        try {
            await axiosConfig.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully!");

            get().disconnectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosConfig.post("/auth/login", data);
            set({ authUser: response.data });
            toast.success("Logged in successfully!");

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosConfig.put("/auth/update-profile", data);
            set({ authUser: response.data.data });

            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) {
            return;
        }

        const socket = io(BASE_URL, {
            query: {
                userId: authUser.id
            }
        });
        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
        }
    },
}))