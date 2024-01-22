import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {useStreamChat} from "@/store/use-stream-chat";
import {RiExpandLeftLine, RiExpandRightLine} from "react-icons/ri";
import {IoChatboxOutline, IoPeopleOutline} from "react-icons/io5";

interface StreamCharProps {
  className?: string;
}

interface StreamChatToggleProps {
  className?: string;
}

interface ChatVariantToggleProps {
  className?: string;
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

export default function StreamChat({className}: StreamCharProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <nav className={"border-b flex items-center p-2"}>
        <StreamChatToggle className={"flex-none"}/>
        <span className={"font-semibold flex-auto text-center"}>Stream Chat</span>
        <ChatVariantToggle className={"flex-none"}/>
      </nav>
    </div>
  )
}