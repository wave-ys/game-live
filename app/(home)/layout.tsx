import HomeNavbar from "@/app/(home)/_components/navbar";
import React from "react";
import {getUserProfileApi} from "@/api/auth";
import {ThemeProvider} from "@/components/theme-provider";

interface HomeLayoutProps {
  children: React.ReactNode
}

export default async function HomeLayout({children}: HomeLayoutProps) {
  const self = await getUserProfileApi();

  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <HomeNavbar userProfile={self}/>
      <main className={"pt-14"}>
        {children}
      </main>
    </ThemeProvider>
  )
}