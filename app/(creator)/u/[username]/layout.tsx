import React from "react";
import {getUserProfileApi} from "@/api/auth";
import {ThemeProvider} from "@/components/theme-provider";
import {redirect} from "next/navigation";
import CreatorNavbar from "@/app/(creator)/u/[username]/_components/navbar";

interface CreatorLayoutProps {
  children: React.ReactNode;
  params: {
    username: string;
  }
}

export default async function CreatorLayout({children, params}: CreatorLayoutProps) {
  const self = await getUserProfileApi();
  if (self == null || self.username !== params.username)
    redirect("/");

  return (
    <ThemeProvider storageKey={"creator"} attribute="class" defaultTheme="dark">
      <CreatorNavbar userProfile={self}/>
      <main className={"pt-14"}>
        {children}
      </main>
    </ThemeProvider>
  )
}