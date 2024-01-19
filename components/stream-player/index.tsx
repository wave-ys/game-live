'use client';

import {MediaPlayer, MediaProvider} from '@vidstack/react';
import {defaultLayoutIcons, DefaultVideoLayout} from '@vidstack/react/player/layouts/default';
import {cn} from "@/lib/utils";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import './styles.css'
import {getStreamApiUrl, UserProfileModel} from "@/api";

interface StreamPlayerProps {
  className?: string;
  userProfileModel: UserProfileModel;
}

export default function StreamPlayer({className, userProfileModel}: StreamPlayerProps) {
  return (
    <div className={cn("overflow-hidden h-full", className)}>
      <MediaPlayer className={"h-full"} title="Sprite Fight"
                   src={{
                     src: getStreamApiUrl(userProfileModel.username, "hls"),
                     type: "application/vnd.apple.mpegurl"
                   }}>
        <MediaProvider></MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons}/>
      </MediaPlayer>
    </div>
  )
}