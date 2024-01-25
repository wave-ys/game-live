import {UserProfileModel} from "@/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import DropdownMenuLogoutItem from "@/components/user-button/dropdown-menu-logout-item";
import DropdownMenuLoginItem from "@/components/user-button/dropdown-menu-login-item";
import DropdownMenuThemeItem from "@/components/user-button/dropdown-menu-theme-item";
import DropdownMenuCreatorDashboardItem from "@/components/user-button/dropdown-menu-creator-dashboard-item";
import DropdownMenuChangeAvatarItem from "@/components/user-button/dropdown-menu-change-avatar-item";
import MyAvatar from "@/components/user-button/my-avatar";

interface UserButtonProps {
  userProfile: UserProfileModel | null;
}

export default function UserButton({userProfile}: UserButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <MyAvatar/>
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
              <DropdownMenuCreatorDashboardItem userProfile={userProfile}/>
              <DropdownMenuChangeAvatarItem/>
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