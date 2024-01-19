import {HiOutlineStatusOffline} from "react-icons/hi";

export default function StreamOffline({username}: { username: string }) {
  return (
    <div className="h-full flex flex-col space-y-4 justify-center items-center">
      <HiOutlineStatusOffline className="h-10 w-10 text-muted-foreground"/>
      <p className="text-muted-foreground">
        {username} is offline
      </p>
    </div>
  )
}