import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {FiHome} from "react-icons/fi";

export default function DropdownMenuBackHomeItem() {
  return (
    <Link href={`/`}>
      <DropdownMenuItem>
        <FiHome className={"w-4 h-4 me-2"}/>
        Back to GameLive
      </DropdownMenuItem>
    </Link>
  )
}