'use client'

import { Store } from "@/generated/prisma"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useState } from "react"
import { useStoreModal } from "@/store/use-store-modal"
import { useParams, useRouter } from "next/navigation"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"

type PopOverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopOverTriggerProps {
    items: Store[]
}

const StoreSwitcher = (
    {
        className,
        items = []
    } : StoreSwitcherProps
) => {
    const [open, setOpen] = useState(false)

    const storeModel = useStoreModal()
    const params = useParams()
    const router = useRouter()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === params.storeId)

    const onStoreSelect = (store: {value: string, label: string}) => {
        setOpen(false)
        router.push(`/${store.value}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                variant='outline'
                size='sm'
                role="combobox"
                aria-expanded={open}
                aria-label="Pilih Toko"
                className={cn(
                    'w-[200px] justify-between text-white bg-white/20 border-white/30' ,
                    className
                )}
                >
                    <StoreIcon className="mr-2 h-4 w-4" />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[200px] p-0 bg-white/20 text-white border-white/30">
                <Command>
                    <CommandList>
                            <CommandInput placeholder="Cari Toko"/>
                            <CommandEmpty>Toko Tidak Ditemukan</CommandEmpty>
                            <CommandGroup heading='Toko'>
                                {formattedItems.map((store) => (
                                    <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className="text-sm"
                                    >
                                        <StoreIcon className="mr-2 h-4 w-4"/>
                                        {store.label}
                                        <Check className={cn(
                                            'ml-auto h-4 w-4',
                                            currentStore?.value === store.value ? 'opacity-100' : 'opacity-0'
                                        )}/>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator/>
                        <CommandList>
                            <CommandGroup>
                                <CommandGroup>
                                    <CommandItem 
                                    className="cursor-pointer"
                                    onSelect={() => {
                                        setOpen(false)
                                        storeModel.onOpen()
                                    }}>
                                        <PlusCircle className="mr-2 h-5 w-5"/>
                                        Buat Toko
                                    </CommandItem>
                                </CommandGroup>
                            </CommandGroup>
                        </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
 
export default StoreSwitcher;