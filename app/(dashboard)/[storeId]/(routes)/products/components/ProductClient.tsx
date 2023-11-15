"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { ProductColumn, columns } from "./Columns"
import { Heading } from "@/components/ui/Heading"
import { ApiList } from "@/components/ui/ApiList"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"

interface ProductClientProps {
    products: ProductColumn[]
}

export const ProductClient = ({ products }: ProductClientProps) => {
    const parmas = useParams()
    const router = useRouter()

  return (
    <>
        <div className="flex items-center justify-between">
            <Heading title={`Products (${products.length})`} description="Manage products for your store." />
            <Button onClick={() => router.push(`/${parmas.storeId}/products/new`)}>
                <Plus className="mr-2 h-4 w-4"/>
                Add New
            </Button>
        </div>
        <Separator />
        <DataTable columns={columns} data={products} searchKey="name"/>
        <Heading title="API" description="API endpoints for products."/>
        <Separator />
        <ApiList entityName="products" entityIdName="productId"/>
    </>
  )
}
