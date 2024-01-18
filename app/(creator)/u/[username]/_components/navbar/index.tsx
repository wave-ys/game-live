import LoginButton from "@/components/login-button";
import {UserProfileModel} from "@/api";
import UserButton from "@/components/user-button";

interface CreatorNavbarProps {
  userProfile: UserProfileModel | null
}

export default function CreatorNavbar({userProfile}: CreatorNavbarProps) {
  return (
    <nav className={"fixed h-14 w-full shadow border-b flex items-center px-2"}>
      <div className={"flex-grow w-full flex-shrink-[2] justify-start text-xl"}>
        Home
      </div>
      <div className={"flex-grow w-full flex-shrink"}></div>
      <div className={"flex-grow w-full flex-shrink-[2] flex justify-end space-x-4 items-center"}>
        {!userProfile && <LoginButton/>}
        <UserButton userProfile={userProfile}/>
      </div>
    </nav>
  )
}