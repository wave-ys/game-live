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
import StreamChart from "@/components/stream-player/chart";
import StreamInfoEditor, {PlayerStreamModel} from "@/components/stream-player/info-editor";
import StreamInfo from "@/components/stream-player/info";

interface StreamPlayerProps {
  className?: string;
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  isSelf: boolean;
}

type LiveStatus = 'loading' | 'on' | 'off';

export default function StreamPlayer({className, userProfileModel, streamModel, isSelf}: StreamPlayerProps) {
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
    <div className={cn("h-full grid grid-cols-4", className)}>
      <div className={"h-full col-span-3 overflow-y-auto scroll-m-0"}>
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
          <StreamInfo isSelf={isSelf} className={"m-4"} streamModel={streamModel} userProfileModel={userProfileModel}/>
          {isSelf &&
              <StreamInfoEditor className={"m-4"} streamModel={streamModel} userProfileModel={userProfileModel}/>}
        </div>
      </div>
      <StreamChart className={"border-l col-span-1"}/>
    </div>
  )
}