import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function SetupPage() {
  return (
    <>
        <h1>Custom CMS | Protected route</h1>
        <UserButton afterSignOutUrl='/'/>
    </>
  )
}
