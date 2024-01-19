'use client';

import {MediaPlayer, MediaProvider} from '@vidstack/react';
import {defaultLayoutIcons, DefaultVideoLayout} from '@vidstack/react/player/layouts/default';
import {cn} from "@/lib/utils";

import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import './styles.css'

interface StreamPlayerProps {
  className?: string;
}

export default function StreamPlayer({className}: StreamPlayerProps) {
  return (
    <div className={cn("overflow-hidden h-full", className)}>
      <MediaPlayer className={"h-full"} title="Sprite Fight"
                   src="http://localhost:8888/live/2663d813-e932-4f9d-a17f-36b88b2b6be1/index.m3u8">
        <MediaProvider></MediaProvider>
        <DefaultVideoLayout icons={defaultLayoutIcons}/>
      </MediaPlayer>
    </div>
  )
}