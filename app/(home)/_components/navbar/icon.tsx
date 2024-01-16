import Link from "next/link";
import {IoGameController} from "react-icons/io5";

interface WebsiteIconProps {
  className?: string
}

export default function WebsiteIcon({className}: WebsiteIconProps) {
  return (
    <Link href={"/"} className={className}>
      <IoGameController className={"h-8 w-8 text-violet-700 inline"}/>
    </Link>
  )
}