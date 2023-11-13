"use client"

import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { AlertModal } from "@/components/modals/AlertModal"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { billboard } from "@prisma/client"
import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

interface billboardFormProps {
    billboard: billboard | null
}

const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
})

type billboardFormValues = z.infer<typeof formSchema>

export const BillboardForm = ({ billboard }: billboardFormProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = billboard ? "Edit Billboard" : "Create Billboard"
    const description = billboard ? "Edit your billboard properties." : "Create a new billboard"
    const toastMessage = billboard ? "Billboard successfully updated!" : "Billboard successfully created!"
    const action = billboard ? "Save changes" : "Create"

    const form = useForm<billboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: billboard || {
            label: "",
            imageUrl: ""

        }
    })

    const onSubmit = async (data: billboardFormValues) => {
        try {
            setLoading(true)
            if (billboard) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/billboards`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Oops, something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh()
            router.push(`/${params.storeId}/billboards`)
            toast.success("Billboard was successfully deleted!")
        } catch (error) {
            toast.error("Make sure your billboard is empty  .")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }

    return (
        <>
            <AlertModal isOpen={open} loading={loading} onClose={() => setOpen(false)} onConfirm={onDelete} />
            <div className="flex items-center justify-between">
                <Heading title={title} description={description} />
                {billboard && (
                    <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField control={form.control} name="imageUrl" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value ? [field.value] : []}
                                    disabled={loading}
                                    onChange={(url) => field.onChange(url)}
                                    onRemove={() => field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="label" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Billboard label" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <Button disabled={loading} type="submit" className="ml-auto">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}
