import {LOGIN_API_URL} from "@/api";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {TbLogin2} from "react-icons/tb";

export default function DropdownMenuLoginItem() {
  return (
    <a href={LOGIN_API_URL}>
      <DropdownMenuItem>
        <TbLogin2 className={"h-4 w-4 me-2"}/>
        Log In
      </DropdownMenuItem>
    </a>
  )
}