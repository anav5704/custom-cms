"use client"

import * as z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useStoreModal } from "@/hooks/use-store-modal"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import Modal from "@/components/ui/modal"

const formSchema = z.object({
    name: z.string().min(1),

})

export const StoreModal = () => {
    const storeMoal = useStoreModal()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "" }
    })

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        //TODO create store 
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
                                        <Input placeholder="E-commerce store" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button variant="outline" onClick={storeMoal.onClose}>Cancel</Button>
                                <Button type="submit">Create</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}