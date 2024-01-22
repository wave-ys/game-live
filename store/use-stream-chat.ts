import {create} from "zustand";

interface StreamChatState {
  collapsed: boolean;
  variant: 'community' | 'chat';
  collapse: () => void;
  expand: () => void;
  setVariant: (v: 'community' | 'chat') => void;
}

export const useStreamChat = create<StreamChatState>(setState => ({
  collapsed: false,
  variant: 'chat',
  collapse: () => setState({collapsed: true}),
  expand: () => setState({collapsed: false}),
  setVariant: (v) => setState({variant: v})
}));