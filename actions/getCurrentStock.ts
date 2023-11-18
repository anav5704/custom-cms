import prismadb from "@/lib/prismadb";

export const getCurrentStock = async (storeId: string) => {
    const currentStock = await prismadb.product.count({
        where: {
            storeId,
            isArchived: false,
        }
    });

    return currentStock;
};
