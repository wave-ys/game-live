'use client';

import SidebarHeader from "@/app/(home)/_components/sidebar/header";
import {FiVideo} from "react-icons/fi";
import React from "react";
import {SidebarItemModel} from "@/api";
import UserItem from "@/app/(home)/_components/sidebar/user-item";

interface RecommendedProps {
  className?: string;
  list: SidebarItemModel[];
}

export default function Recommended({className, list}: RecommendedProps) {
  if (list.length === 0)
    return <></>

  return (
    <div className={className}>
      <SidebarHeader title={"Recommended Channels"} icon={
        <FiVideo className={"h-5 w-5 text-muted-foreground"}/>
      }/>
      <ul className={"space-y-2 pt-1 w-full"}>
        {list.map(item => (
          <UserItem key={item.id} item={item}/>
        ))}
      </ul>
    </div>
  )
}