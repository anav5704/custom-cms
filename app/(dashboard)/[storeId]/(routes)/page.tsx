import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, DollarSign, Package } from "lucide-react"
import { getTotalRevenue } from "@/actions/getTotalRevenue"
import { getCurrentStock } from "@/actions/getCurrentStock"
import { getGraphRevenue } from "@/actions/getGraphRevenue"
import { getSalesCount } from "@/actions/getSalesCount"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/Heading"
import { Overview } from "@/components/Overview"
import { formatter } from "@/lib/utils"
import prismadb from "@/lib/prismadb"

interface DashboardPageProps {
    params: { storeId: string }
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
    const totalRevenue = await getTotalRevenue(params.storeId)
    const totalSales = await getSalesCount(params.storeId)
    const currentStock = await getCurrentStock(params.storeId)
    const graphReveue = await getGraphRevenue(params.storeId)

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Heading title="Dashboard" description="Overview of your store." />
                <Separator />
                <div className="grid gap-4 grid-cols-3 ">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total revenue
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatter.format(totalRevenue)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Sales
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                +{totalSales}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Current Stock
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {currentStock}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card className="col-span-4">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <CardTitle>Overview</CardTitle>
                        <CardContent className="pl-2">
                            <Overview data={graphReveue} />
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
        </div>
    )
}

export default DashboardPage