import WebsiteIcon from "@/app/(home)/_components/navbar/icon";
import LoginButton from "@/app/(home)/_components/navbar/login-button";
import {UserProfileModel} from "@/api";
import UserButton from "@/app/(home)/_components/navbar/user-button";

interface HomeNavbarProps {
  userProfile: UserProfileModel | null
}

export default function HomeNavbar({userProfile}: HomeNavbarProps) {
  return (
    <nav className={"fixed h-14 w-full shadow border-b flex items-center px-2"}>
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