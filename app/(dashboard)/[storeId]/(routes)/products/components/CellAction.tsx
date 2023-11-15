"use client"

import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AlertModal } from "@/components/modals/AlertModal"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ProductColumn } from "./Columns"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

interface CellActionProps {
    data: ProductColumn
}

export const CellAction = ({ data }: CellActionProps) => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const params = useParams()
    const router = useRouter()

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id)
        toast.success("Billboard Id copied to clipboard!")
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/products/${data.id}`)
            router.refresh()
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>Copy Id</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/products/${data.id}`)}>Update</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpen(true)}><span className="text-red-500">Delete</span></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
