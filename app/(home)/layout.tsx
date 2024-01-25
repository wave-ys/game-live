import HomeNavbar from "@/app/(home)/_components/navbar";
import React from "react";
import {getUserProfileApi} from "@/api/auth";
import {ThemeProvider} from "@/components/theme-provider";
import Sidebar from "@/app/(home)/_components/sidebar";
import PageMain from "@/app/(home)/_components/page-main";

interface HomeLayoutProps {
  children: React.ReactNode
}

export default async function HomeLayout({children}: HomeLayoutProps) {
  const self = await getUserProfileApi();

  return (
    <ThemeProvider storageKey={"home"} attribute="class" defaultTheme="light">
      <HomeNavbar userProfile={self}/>
      <main className={"pt-14"}>
        <Sidebar/>
        <PageMain>
          {children}
        </PageMain>
      </main>
    </ThemeProvider>
  )
}