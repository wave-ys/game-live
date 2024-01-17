import {UserProfileModel} from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import DropdownMenuLogoutItem from "@/app/(home)/_components/navbar/dropdown-menu-logout-item";
import DropdownMenuLoginItem from "@/app/(home)/_components/navbar/dropdown-menu-login-item";

interface UserButtonProps {
  userProfile: UserProfileModel | null;
}

export default function UserButton({userProfile}: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar src={"/avatars/01.png"} alt={userProfile?.username ?? "user"}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {
          userProfile && (
            <>
              <DropdownMenuLabel className="font-normal">
                {userProfile.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
            </>
          )
        }
        <DropdownMenuSeparator/>
        {userProfile ? <DropdownMenuLogoutItem/> : <DropdownMenuLoginItem/>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}