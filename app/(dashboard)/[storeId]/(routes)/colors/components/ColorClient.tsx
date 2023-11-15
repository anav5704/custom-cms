"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { ColorColumn, columns } from "./Columns"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/ApiList"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface ColorClientProps {
    colors: ColorColumn[]
}

export const ColorClient = ({ colors }: ColorClientProps) => {
    const parmas = useParams()
    const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Colors (${colors.length})`} description="Manage colors for your store." />
            <Button onClick={() => router.push(`/${parmas.storeId}/colors/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={colors} searchKey="name"/>
        <Heading title="API" description="API endpoints for colors."/>
        <Separator />
        <ApiList entityName="colors" entityIdName="colorId"/>
    </>
  )
}
