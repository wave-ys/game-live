import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {FaRegUser} from "react-icons/fa";

interface UserAvatarProps {
  src?: string;
  alt: string;
  className?: string;
  fallBackClassName?: string;
  isLive?: boolean;
  hideBadge?: boolean;
}

export default function UserAvatar({src, alt, className, fallBackClassName, isLive, hideBadge}: UserAvatarProps) {
  return (
    <div className={"relative"}>
      <Avatar
        className={cn("h-9 w-9", isLive && "ring-2 ring-red-500 ring-offset-2 ring-offset-background", className)}>
        <AvatarImage src={src} alt={alt}/>
        <AvatarFallback delayMs={1000}>
          <FaRegUser className={cn("h-4 w-4", fallBackClassName)}/>
        </AvatarFallback>
      </Avatar>
      {isLive && !hideBadge && (
        <span
          className={"bg-red-500 rounded px-1 py-0.5 text-xs font-semibold text-white absolute z-40 left-1/2 transform -translate-x-1/2 -bottom-2.5 border border-background"}>
          LIVE
        </span>
      )}
    </div>
  )
}