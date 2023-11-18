import { StoreSwitcher } from '@/components/StoreSwitcher'
import { Navlinks } from '@/components/Navlinks'
import { UserButton, auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import prismadb from '@/lib/prismadb'

const Navbar = async () => {
    const { userId } = auth()

    if(!userId) redirect("/sign-in")

    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    })

    return (
        <nav className='border-b'>
            <div className='flex h-16 px-4 items-center'>
                
                <StoreSwitcher stores={stores}/>

                <Navlinks className='mx-6'/>

                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl='/' />
                </div>

            </div>
        </nav>
    )
}

export default Navbar