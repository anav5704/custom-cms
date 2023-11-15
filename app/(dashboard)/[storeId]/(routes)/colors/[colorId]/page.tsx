import prismadb from "@/lib/prismadb"
import { ColorForm } from "./components/ColorForm"

const NewColorPage = async ({ params }: { params: { colorId: string } }) => {
    const color = await prismadb.color.findUnique({
        where: {
            id: params.colorId
        }
    })
    
  return (
    <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ColorForm color={color}/>
        </div> 
    </div>
  )
}

export default NewColorPage