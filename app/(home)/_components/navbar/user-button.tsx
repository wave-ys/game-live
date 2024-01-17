import {getAvatarApiUrl, UserProfileModel} from "@/api";
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
import DropdownMenuThemeItem from "@/app/(home)/_components/navbar/dropdown-menu-theme-item";

interface UserButtonProps {
  userProfile: UserProfileModel | null;
}

export default function UserButton({userProfile}: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar src={userProfile ? getAvatarApiUrl(userProfile.id) : undefined}
                      alt={userProfile?.username ?? "user"}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        {
          userProfile && (
            <>
              <DropdownMenuLabel className="select-none text-center font-semibold">
                {userProfile.username}
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
            </>
          )
        }
        <DropdownMenuThemeItem/>
        <DropdownMenuSeparator/>
        {userProfile ? <DropdownMenuLogoutItem/> : <DropdownMenuLoginItem/>}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}