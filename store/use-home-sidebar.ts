import {create} from "zustand";

interface HomeSidebarStore {
  collapsed: boolean;
  expand: () => void;
  collapse: () => void;
}

export const useHomeSidebar = create<HomeSidebarStore>((set) => ({
  collapsed: false,
  expand: () => set(() => ({collapsed: false})),
  collapse: () => set(() => ({collapsed: true}))
}));