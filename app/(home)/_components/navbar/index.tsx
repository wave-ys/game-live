import WebsiteIcon from "@/app/(home)/_components/navbar/icon";
import LoginButton from "@/app/(home)/_components/navbar/login-button";

export default function HomeNavbar() {
  return (
    <nav className={"fixed h-14 w-full shadow flex items-center px-2"}>
      <div className={"flex-grow w-full flex-shrink-[2] justify-start"}>
        <WebsiteIcon className={"ms-2"}/>
      </div>
      <div className={"flex-grow w-full flex-shrink"}></div>
      <div className={"flex-grow w-full flex-shrink-[2] flex justify-end"}>
        <LoginButton/>
      </div>
    </nav>
  )
}