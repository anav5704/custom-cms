import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ModalProvider } from '@/providers/ModalProvider'
import { ToasterProvider } from '@/providers/ToastPrpvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'E-commerce CMS',
    description: 'This is a custom build content management system made to manage the ecommerse website I had made.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        // Clerk is used for user authentication
        <ClerkProvider>
            <html lang="en">
                <body className={inter.className}>
                    <ToasterProvider />
                    <ModalProvider />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}
