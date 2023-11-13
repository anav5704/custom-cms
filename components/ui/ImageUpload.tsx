"use client"

import { CldUploadWidget } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

interface ImageUploadProps {
    disabled?: boolean,
    onChange: (value: string) => void,
    onRemove: (value: string) => void,
    value: string[]
}

export const ImageUpload = ({ disabled, onChange, onRemove, value}: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false)
    
    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onUpload = async (result: any) => {
        onChange(result.info.secure_url)
    }
    
    if (!isMounted) return null

  return (
    <div>
        <div className="mb-4 flex items-center gap-4">
            {value.map((url) => (
                <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                    <div className="z-10 absolute top-2 right-2">
                        <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(url)}>
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image className="object-cover" fill src={url} alt="Image for billboard"/>
                </div>
            ))}
        </div>
        <CldUploadWidget onUpload={onUpload} uploadPreset="s9m9bavk">
        {({ open }) => {
            const onClick = () => {
                open()
            }

            return (
                <Button type="button" disabled={disabled} variant="secondary" onClick={onClick}>
                    <ImagePlus className="h-4 w-4 mr-2"/>
                    Upload image
                </Button>
            )
        }}
        </CldUploadWidget>
    </div>
  )
}