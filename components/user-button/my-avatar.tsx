'use client';

import UserAvatar from "@/components/user-avatar";
import {useMyAvatar} from "@/store/use-my-avatar";

export default function MyAvatar() {
  const url = useMyAvatar(state => state.url);

  return (
    <UserAvatar src={url} alt={"avatar"}/>
  )
}