"use client"

import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useStoreModal } from "@/hooks/use-store-modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Modal from "@/components/ui/modal"
import toast from "react-hot-toast"
import axios from "axios"

const formSchema = z.object({
    name: z.string().min(1),

})

export const StoreModal = () => {
    const [loading, setLoading] = useState(false)

    const storeMoal = useStoreModal()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "" }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const respone =  await axios.post("/api/stores", values)
            toast.success("Store was successfully created!")
        } catch (error) {
            toast.error("Oops, something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal title="Create Store" description="You do not have any stores yet. Create one to continue" isOpen={storeMoal.isOpen} onClose={storeMoal.onClose}>
            <div>
                <div className="space-y-4 py-4 pb-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Store</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="E-commerce store" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading} variant="outline" onClick={storeMoal.onClose}>Cancel</Button>
                                <Button disabled={loading} type="submit">Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}