import '../globals.css'
import type { Metadata } from 'next'
import {ClerkProvider} from '@clerk/nextjs'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Threads',
  description: 'Threads is a forum for discussing anything.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <main className='bg-dark-1 min-h-screen'>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  )
}