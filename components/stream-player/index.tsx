'use client';

import {MediaPlayer, MediaProvider} from '@vidstack/react';
import {defaultLayoutIcons, DefaultVideoLayout} from '@vidstack/react/player/layouts/default';
import {cn} from "@/lib/utils";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import './styles.css'
import {getStreamApiUrl, UserProfileModel} from "@/api";
import {useEffect, useState} from "react";
import {HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import StreamOffline from "@/components/stream-player/offline";
import StreamLoading from "@/components/stream-player/loading";

interface StreamPlayerProps {
  className?: string;
  userProfileModel: UserProfileModel;
}

type LiveStatus = 'loading' | 'on' | 'off';

export default function StreamPlayer({className, userProfileModel}: StreamPlayerProps) {
  const [liveStatus, setLiveStatus] = useState<LiveStatus>('loading');

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("/api/event")
      .withAutomaticReconnect()
      .configureLogging(process.env.NODE_ENV === 'development' ? LogLevel.Information : LogLevel.None)
      .build();

    async function subscribeLiveStatus() {
      connection.on('liveStatus', ({live}: { live: boolean }) => {
        setLiveStatus(live ? 'on' : 'off');
      });
      try {
        await connection.start();
      } catch (e) {
        return;
      }
      await connection.invoke('subscribeLiveStatus', userProfileModel.id);
    }

    subscribeLiveStatus().then();

    return () => {
      connection.stop().then();
    }
  }, [userProfileModel.id]);

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