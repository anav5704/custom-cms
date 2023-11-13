import { SettingsForm } from "./components/SettingsForm"
import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs"
import prismadb from "@/lib/prismadb"

interface settingsPageProps {
    params: { storeId: string }
}

export default async function settingsPage ({ params }: settingsPageProps) {
    const { userId } = auth()
    
    if(!userId) redirect("/sign-in")

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId
        }
    })

    if(!store) redirect("/")

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <SettingsForm store={store}/>
        </div>
    )
}
