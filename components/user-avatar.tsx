import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";
import {FaRegUser} from "react-icons/fa";

interface UserAvatarProps {
  src?: string;
  alt: string;
  className?: string;
}

export default function UserAvatar({src, alt, className}: UserAvatarProps) {
  return (
    <Avatar className={cn("h-9 w-9", className)}>
      <AvatarImage src={src} alt={alt}/>
      <AvatarFallback>
        <FaRegUser className={"h-4 w-4"}/>
      </AvatarFallback>
    </Avatar>
  )
}