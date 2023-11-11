"use client"

import { useStoreModal } from '@/hooks/use-store-modal'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function SetupPage() {
    const onOpen = useStoreModal((state) => state.onOpen)
    const isOpen = useStoreModal((state) => state.isOpen)

    useEffect(() => {
        if(!isOpen){
            onOpen()
        }
    }, [isOpen, onOpen])

  return (
    <>
        <h1>Custom CMS | Protected route</h1>
        <UserButton afterSignOutUrl='/'/>
    </>
  )
}
