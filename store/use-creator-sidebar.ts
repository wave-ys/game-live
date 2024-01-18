import {create} from "zustand";

interface CreatorSidebarState {
  collapsed: boolean;
  collapse: () => void;
  expand: () => void;
}

export const useCreatorSidebar = create<CreatorSidebarState>(setState => ({
  collapsed: false,
  collapse: () => setState({collapsed: true}),
  expand: () => setState({collapsed: false})
}))