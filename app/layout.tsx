import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import React from "react";

import './globals.css'
import {EventHubProvider} from "@/components/event-hub";
import {Toaster} from "sonner";

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'GameLive',
  description: 'A live stream service.',
  icons: '/favicon.png'
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={inter.className}>
    <EventHubProvider>
      <Toaster/>
      {children}
    </EventHubProvider>
    </body>
    </html>
  )
}
