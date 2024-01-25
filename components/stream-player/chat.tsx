import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useStreamChat} from "@/store/use-stream-chat";
import {RiExpandLeftLine, RiExpandRightLine} from "react-icons/ri";
import {IoChatboxOutline, IoPeopleOutline} from "react-icons/io5";
import {Input} from "@/components/ui/input";
import {FormEventHandler, forwardRef, useEffect, useMemo, useRef, useState} from "react";
import {useEventHub} from "@/components/event-hub";
import {UserProfileModel} from "@/api";
import {format} from "date-fns";
import {PlayerStreamModel} from "@/components/stream-player/info-editor";
import {CgBlock, CgUnblock} from "react-icons/cg";
import {toggleBlockAction} from "@/actions/block";
import {useRouter} from "next/navigation";

interface StreamCharProps {
  className?: string;
  userProfileModel: UserProfileModel;
  self: UserProfileModel | null;
  stream: PlayerStreamModel;
  isSelf: boolean;
  isFollower: boolean;
  hasAuthenticated: boolean;
}

interface StreamChatToggleProps {
  className?: string;
}

interface ChatVariantToggleProps {
  className?: string;
}

interface ChatContentProps {
  className?: string;
  chatList: ChatMessage[];
}

interface ChatInputBoxProps {
  className?: string;
  onSubmit?: (text: string) => void;
  loading?: boolean;
  disabled?: {
    value: boolean;
    reason?: string;
  };
}

interface StreamCommunityProps {
  chatUsers: ChatUser[];
  isSelf: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  time: string;
  color: string | null;
  self: boolean;
}

interface ChatUser {
  id: string;
  username: string;
  blocked: boolean;
}

export function StreamChatToggle({className}: StreamChatToggleProps) {
  const {collapse, collapsed, expand} = useStreamChat();

  const handleToggle = () => {
    if (collapsed)
      expand();
    else
      collapse();
  }

  return (
    <Button variant={"ghost"} size={"icon"} onClick={handleToggle} className={className}>
      {collapsed ? <RiExpandLeftLine className={"w-5 h-5"}/> : <RiExpandRightLine className={"w-5 h-5"}/>}
    </Button>
  )
}

function ChatVariantToggle({className}: ChatVariantToggleProps) {
  const {variant, setVariant} = useStreamChat();
  const handleToggle = () => {
    setVariant(variant === 'chat' ? 'community' : 'chat');
  }

  return (
    <Button variant={"ghost"} size={"icon"} onClick={handleToggle} className={className}>
      {variant === 'chat' ? <IoPeopleOutline className={"w-5 h-5"}/> : <IoChatboxOutline className={"w-5 h-5"}/>}
    </Button>
  )
}

const ChatContent = forwardRef<HTMLDivElement, ChatContentProps>(function ChatContent({className, chatList}, ref) {
  if (chatList.length === 0)
    return (
      <div className={cn('flex items-center justify-center text-muted-foreground text-sm', className)}>
        Welcome to the chat!
      </div>
    )
  return (
    <div className={cn("relative", className)}>
      <div ref={ref} className={"absolute bottom-0 h-fit max-h-full overflow-y-auto left-2 right-2 scroll-m-0"}>
        {chatList.map(message => (
          <div key={message.id} className={"space-x-1"}>
            <span>{format(message.time, 'HH:mm')}</span>
            <span className={cn("font-semibold text-foreground")}
                  style={message.color ? {color: message.color} : undefined}>{message.username}:</span>
            <span>{message.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
})

function ChatInputBox({className, onSubmit, loading, disabled}: ChatInputBoxProps) {
  const [value, setValue] = useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!value)
      return;
    onSubmit?.(value);
    setValue('');
  }
  return (
    <form onSubmit={handleSubmit} className={cn("flex space-x-2 p-2", className)}>
      <Input disabled={loading || disabled?.value} value={value} onChange={e => setValue(e.target.value)}
             placeholder={disabled?.reason ?? "Send a message"}/>
      <Button disabled={loading || !value || disabled?.value} type={"submit"}>Chat</Button>
    </form>
  )
}

export function StreamCommunity({chatUsers, isSelf}: StreamCommunityProps) {
  const [search, setSearch] = useState("");

  return (
    <div className={"p-2 flex flex-col space-y-2"}>
      <Input className={"flex-none"} value={search} onChange={e => setSearch(e.target.value)}
             placeholder={"Search..."}/>
      <div className={cn("flex-auto space-y-2")}>
        {chatUsers.map(chatUser => (
          <div key={chatUser.id}
               className={"flex items-center p-2 border border-background hover:border-inherit group rounded-lg"}>
            <span
              className={cn("flex-auto truncate text-sm", chatUser.blocked && "text-muted-foreground line-through")}>
              {chatUser.username}
            </span>
            <div
              className={cn("invisible group-hover:visible hover:text-foreground text-gray-500 rounded-full hover:cursor-pointer p-1", !isSelf && "group-hover:invisible")}
              onClick={() => toggleBlockAction(chatUser.id, !chatUser.blocked)}>
              {chatUser.blocked ? <CgUnblock className={"w-5 h-5"}/> : <CgBlock className={"w-5 h-5"}/>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StreamChat({
                                     className,
                                     userProfileModel,
                                     isSelf,
                                     stream,
                                     hasAuthenticated,
                                     self
                                   }: StreamCharProps) {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const {connected, subscribeChat, unsubscribeChat, sendChat, subscribeChatUsers, unsubscribeChatUsers} = useEventHub();
  const [loading, setLoading] = useState(0);
  const chatContentRef = useRef<HTMLDivElement>(null);
  const streamVariant = useStreamChat(state => state.variant);
  const router = useRouter();

  const handleSendChat = async (text: string) => {
    setLoading(v => v + 1);
    await sendChat(userProfileModel.id, text);
    setLoading(v => v - 1);
  }

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (message: ChatMessage) => setChatList(v => [...v, message]);
    subscribeChat(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeChat(userProfileModel.id, subscriber).then();
    }
  }, [connected, subscribeChat, unsubscribeChat, userProfileModel.id]);

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (users: ChatUser[]) => setChatUsers(users);
    subscribeChatUsers(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeChatUsers(userProfileModel.id, subscriber).then();
    }
  }, [connected, subscribeChat, subscribeChatUsers, unsubscribeChat, unsubscribeChatUsers, userProfileModel.id]);

  useEffect(() => {
    if (!chatContentRef.current)
      return;
    if (chatList[chatList.length - 1].self)
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
  }, [chatList]);

  const disabled = useMemo(() => {
    if (chatUsers.find(u => u.id === self?.id)?.blocked !== false) {
      router.refresh();
      return {
        value: true,
        reason: "You have been blocked"
      }
    }
    if (!hasAuthenticated)
      return {
        value: true,
        reason: "Please login to chat"
      }
    if (!isSelf && !stream.chatEnabled)
      return {
        value: true,
        reason: "Chat is disabled"
      }
    if (!isSelf && stream.chatFollowersOnly)
      return {
        value: true,
        reason: "Chat is for followers only"
      }
    return {
      value: false
    }
  }, [chatUsers, hasAuthenticated, isSelf, self?.id, stream.chatEnabled, stream.chatFollowersOnly]);

  return (
    <div className={cn("flex flex-col", className)}>
      <nav className={"flex-none border-b flex items-center p-2"}>
        <StreamChatToggle className={"flex-none"}/>
        <span className={"font-semibold flex-auto text-center"}>Stream Chat</span>
        <ChatVariantToggle className={"flex-none"}/>
      </nav>
      {streamVariant === "chat" && (
        <>
          <ChatContent ref={chatContentRef} chatList={chatList} className={"flex-auto"}/>
          <ChatInputBox disabled={disabled} loading={!!loading} onSubmit={handleSendChat} className={"flex-none"}/>
        </>
      )}
      {streamVariant === "community" && (
        <StreamCommunity isSelf={isSelf} chatUsers={chatUsers}/>
      )}
    </div>
  )
}