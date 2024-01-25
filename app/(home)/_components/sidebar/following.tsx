'use client';

import SidebarHeader from "@/app/(home)/_components/sidebar/header";
import React from "react";
import UserItem from "@/app/(home)/_components/sidebar/user-item";
import {SidebarItemModel} from "@/api";
import {FaRegHeart} from "react-icons/fa";

interface FollowingProps {
  className?: string;
  list: SidebarItemModel[];
}

export default function Following({className, list}: FollowingProps) {
  if (list.length === 0)
    return <></>

  return (
    <div className={className}>
      <SidebarHeader title={"Following"} icon={
        <FaRegHeart className={"h-5 w-5 text-muted-foreground"}/>
      }/>
      <ul className={"space-y-2 pt-1 w-full"}>
        {list.map(item => (
          <UserItem key={item.id} item={item}/>
        ))}
      </ul>
    </div>
  )
}