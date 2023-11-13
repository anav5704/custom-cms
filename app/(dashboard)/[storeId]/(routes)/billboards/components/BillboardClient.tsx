"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { BillboardColumn, columns } from "./Columns"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/ApiList"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface BillboardClientProps {
    billboards: BillboardColumn[]
}

export const BillboardClient = ({ billboards }: BillboardClientProps) => {
    const parmas = useParams()
    const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Billboards (${billboards.length})`} description="Manage billboards for your store." />
            <Button onClick={() => router.push(`/${parmas.storeId}/billboards/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={billboards} searchKey="label"/>
        <Heading title="API" description="API endpoints for billboards."/>
        <Separator />
        <ApiList entityName="billboards" entityIdName="billboardId"/>
    </>
  )
}
