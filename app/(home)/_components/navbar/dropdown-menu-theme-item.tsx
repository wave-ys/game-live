'use client';

import {useTheme} from "next-themes";
import {DropdownMenuItem} from "@/components/ui/dropdown-menu";
import {IoMoonOutline} from "react-icons/io5";
import {RiCheckLine} from "react-icons/ri";

export default function DropdownMenuThemeItem() {
  const {setTheme, theme} = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <DropdownMenuItem onClick={handleToggleTheme}>
      <IoMoonOutline className={"h-4 w-4 me-2"}/>
      Dark Theme
      {theme === 'dark' && <RiCheckLine className={"h-4 w-4 ms-auto"}/>}
    </DropdownMenuItem>
  )
}