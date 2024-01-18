'use client';

import {UserProfileModel} from "@/api";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {FaRegChartBar} from "react-icons/fa";
import Link from "next/link";
import {usePathname} from "next/navigation";
import DropdownMenuBackHomeItem from "@/components/user-button/dropdown-menu-back-home-item";

export default function DropdownMenuCreatorDashboardItem({userProfile}: { userProfile: UserProfileModel }) {
  const pathname = usePathname();

  if (pathname.startsWith(`/u/${userProfile.username}`))
    return <DropdownMenuBackHomeItem/>

  return (
    <Link href={`/u/${userProfile.username}`}>
      <DropdownMenuItem>
        <FaRegChartBar className={"w-4 h-4 me-2"}/>
        Creator Dashboard
      </DropdownMenuItem>
    </Link>
  )
}