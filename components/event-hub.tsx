'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";

interface EventHubState {
  connected: boolean;
  subscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;
  unsubscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;
}

interface LiveStatusEventMessage {
  userId: string;
  live: boolean;
}

type LiveStatusSubscriber = (userId: string, live: boolean) => void;

const EventHubContext = createContext<EventHubState>({
  connected: false,
  subscribeLiveStatus: () => Promise.resolve(),
  unsubscribeLiveStatus: () => Promise.resolve()
})

const liveStatusSubscribers = new Map<string, Set<LiveStatusSubscriber>>();

export function useEventHub() {
  return useContext(EventHubContext);
}

export function EventHubProvider({children}: { children: React.ReactNode }) {
  const [hubConnection, setHubConnection] = useState<HubConnection>();

  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("/api/event")
      .withAutomaticReconnect()
      .build();

    connection.on('liveStatus', ({userId, live}: LiveStatusEventMessage) => {
      liveStatusSubscribers.get(userId)?.forEach(subscriber => subscriber(userId, live));
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
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      liveStatusSubscribers.delete(userId);
      await hubConnection?.invoke("unsubscribeLiveStatus", userId);
    }
  }

  return (
    <EventHubContext.Provider value={{
      connected: !!hubConnection && hubConnection.state === HubConnectionState.Connected,
      subscribeLiveStatus,
      unsubscribeLiveStatus
    }}>
      {children}
    </EventHubContext.Provider>
  )
}