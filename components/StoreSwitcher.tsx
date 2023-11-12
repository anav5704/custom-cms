"use client"

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Check, ChevronsDown, ChevronsUpDown, PlusCircle, Store } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useStoreModal } from "@/hooks/useStoreModal"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { store } from "@prisma/client" 
import { useState } from "react"
import { cn } from "@/lib/utils"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps {
    stores: store[]
}

export const StoreSwitcher = ({ className, stores = [] }: StoreSwitcherProps) => {
    const [open, setOpen] = useState(false)
    const StoreModal = useStoreModal()
    const params = useParams()
    const router = useRouter()

    const formattedStores = stores.map((store) => ({
        label: store.name,
        value: store.id
    }))

    const currentStore = formattedStores.find((store) => store.value === params.storeId)

    const onStoreSelect = (store: { label: string, value: string }) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button className={cn("w-[200px] justify-between", className)} variant="outline" size="sm" role="combobox" aria-expanded={open} aria-label="Select a store">
                    <Store className="mr-2 h-4 w-4"/>
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store"/>
                        <CommandEmpty>No store found</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedStores.map((store) => (
                                <CommandItem key={store.value} onSelect={() => onStoreSelect(store)} className="text-sm"> 
                                    {store.label}
                                    <Check className={cn("ml-auto h-4 w-4", currentStore?.value === store.value ? "opacity-100" : "opacity-0")}/>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator />
                    <CommandList>
                        <CommandGroup>
                            <CommandItem onSelect={() => {
                                setOpen(false)
                                StoreModal.onOpen()
                            }}>
                            <PlusCircle className="mr-2 h-5 w-5"/>
                            New Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover> 
    )
}
