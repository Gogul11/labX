import { create } from "zustand";

type adminStoreType = {
    dir: string;
    initialFetch: boolean;
    setInitialFetch: () => void;
    setDir: (newDir: string) => void;
};

export const adminStore = create<adminStoreType>((set) => ({
    dir: "",
    setDir: (newDir) => set({ dir: newDir }),

    initialFetch: false,
    setInitialFetch: () =>
        set((state) => ({
            initialFetch: !state.initialFetch,
        })),
}));
