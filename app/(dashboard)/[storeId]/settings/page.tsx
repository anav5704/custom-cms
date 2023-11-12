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
        <div className="flex-col p-4">
            <SettingsForm store={store}/>
        </div>
    )
}
