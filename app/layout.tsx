import { ToasterProvider } from '@/providers/ToastPrpvider'
import { ModalProvider } from '@/providers/ModalProvider'
import { ThemeProvider } from "@/providers/ThemeProvider"
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import './globals.css'

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
                    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
                        <ToasterProvider />
                        <ModalProvider />
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    )
}
