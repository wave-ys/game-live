import LoginButton from "@/components/login-button";
import {UserProfileModel} from "@/api";
import UserButton from "@/components/user-button";
import WebsiteIcon from "@/components/icon";

interface HomeNavbarProps {
  userProfile: UserProfileModel | null
}

export default function HomeNavbar({userProfile}: HomeNavbarProps) {
  return (
    <nav className={"fixed z-50 h-14 w-full shadow border-b flex items-center px-2 bg-background"}>
      <div className={"flex-grow w-full flex-shrink-[2] justify-start"}>
        <WebsiteIcon className={"ms-2"}/>
      </div>
      <div className={"flex-grow w-full flex-shrink"}></div>
      <div className={"flex-grow w-full flex-shrink-[2] flex justify-end space-x-4 items-center"}>
        {!userProfile && <LoginButton/>}
        <UserButton userProfile={userProfile}/>
      </div>
    </nav>
  )
}