"use client"

import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertModal } from "@/components/modals/AlertModal"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { category,  billboard } from "@prisma/client"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

interface categoryFormProps {
    category: category | null
    billboards: billboard[] | null
}

const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
})

type categoryFormValues = z.infer<typeof formSchema>

export const CategoryForm = ({ category, billboards }: categoryFormProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = category ? "Edit category" : "Create category"
    const description = category ? "Edit your category properties." : "Create a new category"
    const toastMessage = category ? "Category successfully updated!" : "Category successfully created!"
    const action = category ? "Save changes" : "Create"

    const form = useForm<categoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: category || {
            name: "",
            billboardId: ""
        }
    })

    const onSubmit = async (data: categoryFormValues) => {
        try {
            setLoading(true)
            if (category) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh()
            router.push(`/${params.storeId}/categories`)
            toast.success("Category was successfully deleted!")
        } catch (error) {
            toast.error("Make sure your category is empty  .")
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
                {category && (
                    <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Category name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="billboardId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Billboard</FormLabel>
                                <Select
                                    disabled={loading}
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a billboard" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {billboards?.map((billboard) => (
                                        <SelectItem key={billboard.id} value={billboard.id}>
                                            {billboard.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
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
