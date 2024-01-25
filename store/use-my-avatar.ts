import {create} from "zustand";
import {getMyAvatarApiUrl} from "@/api";

interface MyAvatarState {
  url: string;
  refresh: () => void;
}

export const useMyAvatar = create<MyAvatarState>(setState => ({
  url: getMyAvatarApiUrl(+new Date()),
  refresh: () => setState({url: getMyAvatarApiUrl(+new Date())})
}));