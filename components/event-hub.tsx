'use client';

import React, {createContext, useContext, useEffect, useState} from "react";
import {HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel} from "@microsoft/signalr";

interface EventHubState {
  connected: boolean;

  subscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;
  unsubscribeLiveStatus: (userId: string, subscriber: LiveStatusSubscriber) => Promise<void>;

  subscribeStreamViewer: (userId: string, subscriber: StreamViewerSubscriber) => Promise<void>;
  unsubscribeStreamViewer: (userId: string, subscriber: StreamViewerSubscriber) => Promise<void>;

  subscribeChat: (userId: string, subscriber: ChatSubscriber) => Promise<void>;
  unsubscribeChat: (userId: string, subscriber: ChatSubscriber) => Promise<void>;
  sendChat: (userId: string, text: string) => Promise<void>;

  subscribeChatUsers: (userId: string, subscriber: ChatUsersSubscriber) => Promise<void>;
  unsubscribeChatUsers: (userId: string, subscriber: ChatUsersSubscriber) => Promise<void>;
}

interface LiveStatusEventMessage {
  userId: string;
  live: boolean;
}

interface StreamViewerEventMessage {
  userId: string;
  viewer: number;
}

interface ChatUsersEventMessageItem {
  id: string;
  username: string;
  blocked: boolean;
}

interface ChatUsersEventMessage {
  userId: string;
  users: ChatUsersEventMessageItem[];
}

interface ChatEventMessage {
  broadcaster: string;
  id: string;
  userId: string;
  username: string;
  text: string;
  time: string;
  color: string | null;
  self: boolean;
}

type LiveStatusSubscriber = (userId: string, live: boolean) => void;
type StreamViewerSubscriber = (userId: string, viewer: number) => void;
type ChatSubscriber = (message: ChatEventMessage) => void;
type ChatUsersSubscriber = (users: ChatUsersEventMessageItem[]) => void;

const EventHubContext = createContext<EventHubState>({
  connected: false,

  subscribeLiveStatus: Promise.resolve,
  unsubscribeLiveStatus: Promise.resolve,

  subscribeStreamViewer: Promise.resolve,
  unsubscribeStreamViewer: Promise.resolve,

  subscribeChat: Promise.resolve,
  unsubscribeChat: Promise.resolve,
  sendChat: Promise.resolve,

  subscribeChatUsers: Promise.resolve,
  unsubscribeChatUsers: Promise.resolve
})

const liveStatusSubscribers = new Map<string, Set<LiveStatusSubscriber>>();
const streamViewerSubscribers = new Map<string, Set<StreamViewerSubscriber>>();
const chatSubscribers = new Map<string, Set<ChatSubscriber>>();
const chatUsersSubscribers = new Map<string, Set<ChatUsersSubscriber>>();

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

    connection.on('chat', (message: ChatEventMessage) => {
      chatSubscribers.get(message.broadcaster)?.forEach(subscriber => subscriber(message));
    });

    connection.on('streamViewerUsers', (message: ChatUsersEventMessage) => {
      chatUsersSubscribers.get(message.userId)?.forEach(subscriber => subscriber(message.users));
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

  const subscribeChat = async (userId: string, subscriber: ChatSubscriber) => {
    if (!chatSubscribers.has(userId)) {
      chatSubscribers.set(userId, new Set<ChatSubscriber>().add(subscriber));
      await hubConnection?.invoke("subscribeChat", userId);
    } else
      chatSubscribers.get(userId)!.add(subscriber);
  }

  const unsubscribeChat = async (userId: string, subscriber: ChatSubscriber) => {
    const subscribers = chatSubscribers.get(userId);
    if (!subscribers)
      return;
    if (!subscribers.has(subscriber))
      return;
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      chatSubscribers.delete(userId);
      await hubConnection?.invoke("unsubscribeChat", userId);
    }
  }

  const sendChat = async (userId: string, text: string) => {
    hubConnection?.invoke('sendChat', userId, text);
  }

  const subscribeChatUsers = async (userId: string, subscriber: ChatUsersSubscriber) => {
    if (!chatUsersSubscribers.has(userId)) {
      chatUsersSubscribers.set(userId, new Set<ChatUsersSubscriber>().add(subscriber));
      await hubConnection?.invoke("subscribeChatUsers", userId);
    } else
      chatUsersSubscribers.get(userId)!.add(subscriber);
  }

  const unsubscribeChatUsers = async (userId: string, subscriber: ChatUsersSubscriber) => {
    const subscribers = chatUsersSubscribers.get(userId);
    if (!subscribers)
      return;
    if (!subscribers.has(subscriber))
      return;
    subscribers.delete(subscriber);
    if (subscribers.size === 0) {
      chatUsersSubscribers.delete(userId);
      await hubConnection?.invoke("unsubscribeChatUsers", userId);
    }
  }


  return (
    <EventHubContext.Provider value={{
      connected: !!hubConnection && hubConnection.state === HubConnectionState.Connected,
      subscribeLiveStatus,
      unsubscribeLiveStatus,
      subscribeStreamViewer,
      unsubscribeStreamViewer,
      subscribeChat,
      unsubscribeChat,
      sendChat,
      subscribeChatUsers,
      unsubscribeChatUsers
    }}>
      {children}
    </EventHubContext.Provider>
  )
}