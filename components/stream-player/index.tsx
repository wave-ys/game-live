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

interface StreamPlayerProps {
  className?: string;
  userProfileModel: UserProfileModel;
}

type LiveStatus = 'loading' | 'on' | 'off';

export default function StreamPlayer({className, userProfileModel}: StreamPlayerProps) {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('loading');
  const {connected, subscribeLiveStatus, unsubscribeLiveStatus} = useEventHub();

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (userId: string, live: boolean) => setLiveStatus(live ? 'on' : 'off');
    subscribeLiveStatus(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeLiveStatus(userProfileModel.id, subscriber).then()
    }
  }, [connected, subscribeLiveStatus, unsubscribeLiveStatus, userProfileModel.id]);

  return (
    <div className={cn("overflow-hidden h-full", className)}>
      {liveStatus === 'on' && (
        <MediaPlayer className={"h-full"} title="Sprite Fight"
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
  )
}