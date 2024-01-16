import HomeNavbar from "@/app/(home)/_components/navbar";
import React from "react";

interface HomeLayoutProps {
  children: React.ReactNode
}

export default function HomeLayout({children}: HomeLayoutProps) {
  return (
    <>
      <HomeNavbar/>
      <main className={"pt-14"}>
        {children}
      </main>
    </>
  )
}