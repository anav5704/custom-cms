"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { SizeColumn, columns } from "./Columns"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/ApiList"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface SizeClientProps {
    sizes: SizeColumn[]
}

export const SizeClient = ({ sizes }: SizeClientProps) => {
    const parmas = useParams()
    const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Sizes (${sizes.length})`} description="Manage sizes for your store." />
            <Button onClick={() => router.push(`/${parmas.storeId}/sizes/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={sizes} searchKey="name"/>
        <Heading title="API" description="API endpoints for sizes."/>
        <Separator />
        <ApiList entityName="sizes" entityIdName="sizeId"/>
    </>
  )
}
