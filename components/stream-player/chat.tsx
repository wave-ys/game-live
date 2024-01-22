import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useStreamChat} from "@/store/use-stream-chat";
import {RiExpandLeftLine, RiExpandRightLine} from "react-icons/ri";
import {IoChatboxOutline, IoPeopleOutline} from "react-icons/io5";
import {Input} from "@/components/ui/input";
import {FormEventHandler, useEffect, useState} from "react";
import {useEventHub} from "@/components/event-hub";
import {UserProfileModel} from "@/api";

interface StreamCharProps {
  className?: string;
  userProfileModel: UserProfileModel;
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
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  time: string;
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

function ChatContent({className, chatList}: ChatContentProps) {
  if (chatList.length === 0)
    return (
      <div className={cn('flex items-center justify-center text-muted-foreground text-sm', className)}>
        Welcome to the chat!
      </div>
    )
  return (
    <div className={className}>
      {chatList.map(message => (
        <div key={message.id}>{message.userId} {message.text} {message.time}</div>
      ))}
    </div>
  )
}

function ChatInputBox({className, onSubmit, loading}: ChatInputBoxProps) {
  const [value, setValue] = useState("");
  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit?.(value);
    setValue('');
  }
  return (
    <form onSubmit={handleSubmit} className={cn("flex space-x-2 p-2", className)}>
      <Input disabled={loading} value={value} onChange={e => setValue(e.target.value)} placeholder={"Send a message"}/>
      <Button disabled={loading} type={"submit"}>Chat</Button>
    </form>
  )
}

export default function StreamChat({className, userProfileModel}: StreamCharProps) {
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const {connected, subscribeChat, unsubscribeChat, sendChat} = useEventHub();
  const [loading, setLoading] = useState(0);

  const handleSendChat = async (text: string) => {
    setLoading(v => v + 1);
    await sendChat(userProfileModel.id, text);
    setLoading(v => v - 1);
  }

  useEffect(() => {
    if (!connected)
      return;
    const subscriber = (message: ChatMessage) => setChatList([...chatList, message]);
    subscribeChat(userProfileModel.id, subscriber).then();
    return () => {
      unsubscribeChat(userProfileModel.id, subscriber).then();
    }
  }, [chatList, connected, subscribeChat, unsubscribeChat, userProfileModel.id]);

  return (
    <div className={cn("flex flex-col", className)}>
      <nav className={"flex-none border-b flex items-center p-2"}>
        <StreamChatToggle className={"flex-none"}/>
        <span className={"font-semibold flex-auto text-center"}>Stream Chat</span>
        <ChatVariantToggle className={"flex-none"}/>
      </nav>
      <ChatContent chatList={chatList} className={"flex-auto"}/>
      <ChatInputBox loading={!!loading} onSubmit={handleSendChat} className={"flex-none"}/>
    </div>
  )
}