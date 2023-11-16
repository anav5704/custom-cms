"use client"

import { DataTable } from "@/components/ui/DataTable"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/Heading"
import { OrderColumn, columns } from "./Columns"

interface OrderClientProps {
    orders: OrderColumn[]
}

export const OrderClient = ({ orders }: OrderClientProps) => {
  return (
    <>
        <Heading title={`Orders (${orders.length})`} description="Manage orders for your store." />
        <Separator />
        <DataTable columns={columns} data={orders} searchKey="products"/>
    </>
  )
}
