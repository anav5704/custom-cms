"use client"

import * as z from "zod"

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { category, color, image, product, size } from "@prisma/client"
import { AlertModal } from "@/components/modals/AlertModal"
import { ImageUpload } from "@/components/ui/ImageUpload"
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Heading } from "@/components/ui/Heading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Trash } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

interface ProductFormProps {
    product: product & {
        images: image[]
    } | null,
    categories: category[],
    sizes: size[],
    colors: color[]
}

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string().min(1)}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    sizeId: z.string().min(1),
    colorId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm = ({ product, categories, sizes, colors }: ProductFormProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const title = product ? "Edit product" : "Create product"
    const description = product ? "Edit your product properties." : "Create a new product"
    const toastMessage = product ? "Product successfully updated!" : "Product successfully created!"
    const action = product ? "Save changes" : "Create"

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: product ? {...product, price: parseFloat(String(product?.price))} : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            sizeId: "",
            colorId: "",
            isFeatured: false,
            isArchived: false,
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)
            if (product) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            }
            else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product was successfully deleted!")
        } catch (error) {
            toast.error("Oops, something went wrong!")
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
                {product && (
                    <Button variant="destructive" disabled={loading} size="icon" onClick={() => setOpen(true)}>
                        <Trash className="h-4 w-4" />
                    </Button>)}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField control={form.control} name="images" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value.map((image) => image.url)}
                                    disabled={loading}
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={loading} placeholder="Product name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" disabled={loading} placeholder="Product price" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField control={form.control} name="categoryId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select
                                    disabled={loading}
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {categories?.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField control={form.control} name="sizeId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <Select
                                    disabled={loading}
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a size" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {sizes?.map((size) => (
                                        <SelectItem key={size.id} value={size.id}>
                                            {size.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField control={form.control} name="colorId" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Color</FormLabel>
                                <Select
                                    disabled={loading}
                                    value={field.value}
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue defaultValue={field.value} placeholder="Select a color" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {colors?.map((color) => (
                                        <SelectItem key={color.id} value={color.id}>
                                            {color.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="isFeatured" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page.
                                        </FormDescription>
                                    </div>
                            </FormItem>
                        )}
                        />
                        <FormField control={form.control} name="isArchived" render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox 
                                        checked={field.value}
                                        // @ts-ignore
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear in the store.
                                        </FormDescription>
                                    </div>
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
