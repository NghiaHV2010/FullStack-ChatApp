import { create } from "zustand";

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("myTheme") || "dark",
    setTheme: (theme) => {
        localStorage.setItem("myTheme", theme);
        set({ theme });
    }
}))