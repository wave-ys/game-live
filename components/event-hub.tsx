'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";

interface EventHubState {
  connected: boolean;

  subscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;
  unsubscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;

  subscribeStreamViewer: (userId: string, subscriber: StreamViewerSubscriber) => Promise<void>;
  unsubscribeStreamViewer: (userId: string, subscriber: StreamViewerSubscriber) => Promise<void>;
}

interface LiveStatusEventMessage {
  userId: string;
  live: boolean;
}

interface StreamViewerEventMessage {
  userId: string;
  viewer: number;
}

type LiveStatusSubscriber = (userId: string, live: boolean) => void;
type StreamViewerSubscriber = (userId: string, viewer: number) => void;

const EventHubContext = createContext<EventHubState>({
  connected: false,
  subscribeLiveStatus: Promise.resolve,
  unsubscribeLiveStatus: Promise.resolve,
  subscribeStreamViewer: Promise.resolve,
  unsubscribeStreamViewer: Promise.resolve
})

const liveStatusSubscribers = new Map<string, Set<LiveStatusSubscriber>>();
const streamViewerSubscribers = new Map<string, Set<StreamViewerSubscriber>>();

export function useEventHub() {
  return useContext(EventHubContext);
}

export function EventHubProvider({children}: { children: React.ReactNode }) {
  const [hubConnection, setHubConnection] = useState<HubConnection>();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .configureLogging(LogLevel.None)
      .withUrl("/api/event")
      .withAutomaticReconnect()
      .build();

    connection.on('liveStatus', ({userId, live}: LiveStatusEventMessage) => {
      liveStatusSubscribers.get(userId)?.forEach(subscriber => subscriber(userId, live));
    });

    connection.on('streamViewer', ({userId, viewer}: StreamViewerEventMessage) => {
      streamViewerSubscribers.get(userId)?.forEach(subscriber => subscriber(userId, viewer));
    });

    connection.start().then(() => setHubConnection(connection)).catch(e => console.error(e));
    return () => {
      connection.stop().then();
    }
  }, []);

  const subscribeLiveStatus = async (userId: string, subscriber: LiveStatusSubscriber) => {
    if (!liveStatusSubscribers.has(userId)) {
      liveStatusSubscribers.set(userId, new Set<LiveStatusSubscriber>().add(subscriber));
      await hubConnection?.invoke("subscribeLiveStatus", userId);
    } else
      liveStatusSubscribers.get(userId)!.add(subscriber);
  }

  const unsubscribeLiveStatus = async (userId: string, subscriber: LiveStatusSubscriber) => {
    const subscribers = liveStatusSubscribers.get(userId);
    if (!subscribers)
      return;
    if (!subscribers.has(subscriber))
      return;
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      liveStatusSubscribers.delete(userId);
      await hubConnection?.invoke("unsubscribeLiveStatus", userId);
    }
  }

  const subscribeStreamViewer = async (userId: string, subscriber: StreamViewerSubscriber) => {
    if (!streamViewerSubscribers.has(userId)) {
      streamViewerSubscribers.set(userId, new Set<StreamViewerSubscriber>().add(subscriber));
      await hubConnection?.invoke("subscribeStreamViewer", userId);
    } else
      streamViewerSubscribers.get(userId)!.add(subscriber);
  }

  const unsubscribeStreamViewer = async (userId: string, subscriber: StreamViewerSubscriber) => {
    const subscribers = streamViewerSubscribers.get(userId);
    if (!subscribers)
      return;
    if (!subscribers.has(subscriber))
      return;
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      streamViewerSubscribers.delete(userId);
      await hubConnection?.invoke("unsubscribeStreamViewer", userId);
    }
  }

  return (
    <EventHubContext.Provider value={{
      connected: !!hubConnection && hubConnection.state === HubConnectionState.Connected,
      subscribeLiveStatus,
      unsubscribeLiveStatus,
      subscribeStreamViewer,
      unsubscribeStreamViewer
    }}>
      {children}
    </EventHubContext.Provider>
  )
}