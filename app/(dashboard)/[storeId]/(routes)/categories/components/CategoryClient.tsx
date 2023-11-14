"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { CategoryColumn, columns } from "./Columns"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/ApiList"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface BillboardClientProps {
    ccategories: CategoryColumn[]
}

export const CategoryClient = ({ ccategories }: BillboardClientProps) => {
    const parmas = useParams()
    const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Categories (${ccategories.length})`} description="Manage categories for your store." />
            <Button onClick={() => router.push(`/${parmas.storeId}/categories/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={ccategories} searchKey="name"/>
        <Heading title="API" description="API endpoints for categories."/>
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId"/>
    </>
  )
}
