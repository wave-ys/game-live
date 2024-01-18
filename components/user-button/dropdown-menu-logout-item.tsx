import {LOGOUT_API_URL} from "@/api";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {TbLogout2} from "react-icons/tb";

export default function DropdownMenuLogoutItem() {
  return (
    <a href={LOGOUT_API_URL}>
      <DropdownMenuItem>
        <TbLogout2 className={"h-4 w-4 me-2"}/>
        Log Out
      </DropdownMenuItem>
    </a>
  )
}