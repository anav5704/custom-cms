"use client"

import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertModal } from "@/components/modals/AlertModal"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { ApiAlert } from "@/components/ui/ApiAlert"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { store } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
import useOrigin from "@/hooks/useOrigin"
import toast from "react-hot-toast"
import axios from "axios"

interface SettingsFormProps {
    store: store
}

const formSchema = z.object({
    name: z.string().min(1)
})

type settingsFormValues = z.infer<typeof formSchema>

export const SettingsForm = ({ store }: SettingsFormProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()
    const origin = useOrigin()

    const form = useForm<settingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: store
    })

    const handleSubmit = async (data: settingsFormValues) => {
        try {
            setLoading(true)
            await axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success("Store was successfully updated!")
        } catch (error) {
            toast.error("Oops, something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push("/")
            toast.success("Store was successfully deleted!")
        } catch (error) {
            toast.error("Make sure your store is empty.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} loading={loading} onClose={() => setOpen(false)} onConfirm={onDelete} />
            <div className="flex items-center justify-between">
                <Heading title="Settings" description="Manage your store preferences" />
                <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}>
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Store name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} 
                        />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        Save changes
                    </Button>
                </form>
            </Form>
            <Separator />
            <ApiAlert title="NEXT_PUBLIC_API_URL" description={`${origin}/api/${params.storeId}`} variant="public"/>
        </>
    )
}
