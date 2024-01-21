import UserAvatar from "@/components/user-avatar";
import {getAvatarApiUrl, UserProfileModel} from "@/api";
import {PlayerStreamModel} from "@/components/stream-player/info-editor";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {FaHeart} from "react-icons/fa";

interface StreamInfoProps {
  className?: string;
  userProfileModel: UserProfileModel;
  streamModel: PlayerStreamModel;
  isSelf: boolean;
}

export default function StreamInfo({className, userProfileModel, streamModel, isSelf}: StreamInfoProps) {
  return (
    <div className={cn("flex space-x-4 items-center", className)}>
      <UserAvatar className={"h-16 w-16 flex-none"}
                  fallBackClassName={"h-6 w-6"}
                  src={getAvatarApiUrl(userProfileModel.id)}
                  alt={'avatar'}/>
      <div className={"flex-auto space-y-0.5"}>
        <h2 className={"font-semibold text-lg"}>{userProfileModel.username}</h2>
        <p>{streamModel.name}</p>
        <p className={"text-muted-foreground text-sm"}>{streamModel.live ? 'Live' : 'Offline'}</p>
      </div>
      {
        !isSelf && (
          <Button variant={"primary-blue"}>
            <FaHeart className={"w-4 h-4 mr-2"}/>
            Follow
          </Button>
        )
      }
    </div>
  )
}