'use client';

import {MediaPlayer, MediaProvider} from '@vidstack/react';
import {defaultLayoutIcons, DefaultVideoLayout} from '@vidstack/react/player/layouts/default';
import {cn} from "@/lib/utils";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import './styles.css'
import {getStreamApiUrl, UserProfileModel} from "@/api";
import {useEffect, useState} from "react";
import StreamOffline from "@/components/stream-player/offline";
import StreamLoading from "@/components/stream-player/loading";
import {useEventHub} from "@/components/event-hub";
import StreamChat, {StreamChatToggle} from "@/components/stream-player/chat";
import StreamInfoEditor, {PlayerStreamModel} from "@/components/stream-player/info-editor";
import StreamInfo from "@/components/stream-player/info";
import {useStreamChat} from "@/store/use-stream-chat";
import {useRouter} from "next/navigation";

interface StreamPlayerProps {
  className?: string;
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  isSelf: boolean;
  isFollower: boolean;
  hasAuthenticated: boolean;
  self: UserProfileModel | null;
}

export type LiveStatus = 'loading' | 'on' | 'off';

export default function StreamPlayer(
  {
    className,
    userProfileModel,
    streamModel,
    isSelf,
    isFollower,
    hasAuthenticated,
    self
  }: StreamPlayerProps) {
  const chatCollapsed = useStreamChat(state => state.collapsed);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('loading');
  const {connected, subscribeLiveStatus, unsubscribeLiveStatus} = useEventHub();
  const router = useRouter();

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (userId: string, live: boolean) => {
      const newLiveStatus = live ? 'on' : 'off';
      if (newLiveStatus !== liveStatus) {
        setLiveStatus(newLiveStatus);
        router.refresh();
      }
    }
    subscribeLiveStatus(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeLiveStatus(userProfileModel.id, subscriber).then()
    }
  }, [connected, router, liveStatus, subscribeLiveStatus, unsubscribeLiveStatus, userProfileModel.id]);

  return (
    <div className={cn("relative h-full grid grid-cols-4", chatCollapsed && 'grid-cols-3', className)}>
      <div className={"h-full col-span-3 overflow-y-auto no-scrollbar"}>
        <div className={"h-3/5 border-b"}>
          {liveStatus === 'on' && (
            <MediaPlayer className={"h-full"}
                         src={{
                           src: getStreamApiUrl(userProfileModel.username, "hls"),
                           type: "application/vnd.apple.mpegurl"
                         }}>
              <MediaProvider></MediaProvider>
              <DefaultVideoLayout icons={defaultLayoutIcons}/>
            </MediaPlayer>
          )}
          {liveStatus === 'off' && <StreamOffline username={userProfileModel.username}/>}
          {liveStatus === 'loading' && <StreamLoading/>}
        </div>
        <div>
          <StreamInfo liveStatus={liveStatus} isSelf={isSelf} className={"m-4"} streamModel={streamModel}
                      userProfileModel={userProfileModel} isFollower={isFollower}/>
          {isSelf &&
              <StreamInfoEditor className={"m-4"} streamModel={streamModel} userProfileModel={userProfileModel}/>}
        </div>
      </div>
      {!chatCollapsed &&
          <StreamChat isFollower={isFollower} isSelf={isSelf} stream={streamModel} userProfileModel={userProfileModel}
                      hasAuthenticated={hasAuthenticated} self={self}
                      className={"border-l col-span-1"}/>}
      {chatCollapsed && <StreamChatToggle className={"absolute right-2 top-2"}/>}
    </div>
  )
}