import {useCreatorSidebar} from "@/store/use-creator-sidebar";
import {RiExpandLeftLine, RiExpandRightLine} from "react-icons/ri";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

export default function SidebarHeader() {
  const {collapse, collapsed, expand} = useCreatorSidebar();

  const handleToggle = () => {
    if (collapsed)
      expand();
    else
      collapse();
  }

  return (
    <div className={cn("w-full flex justify-between items-center", collapsed && "justify-center")}>
      {!collapsed && <span className={"uppercase text-sm font-semibold ms-2"}>Creator Dashboard</span>}
      <Button onClick={handleToggle} variant={"ghost"} size={"icon"}>
        {collapsed ? <RiExpandRightLine className={"w-5 h-5"}/> : <RiExpandLeftLine className={"w-5 h-5"}/>}
      </Button>
    </div>
  )
}