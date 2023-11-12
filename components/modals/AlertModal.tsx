"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Modal from "@/components/ui/modal"

interface AlertModalProps {
    isOpen: boolean, 
    onClose: () => void,
    onConfirm: () => void,
    loading: boolean,
}

export const AlertModal = ({ isOpen, onClose, onConfirm, loading}: AlertModalProps) => {
    const [isMounted, setIsMouted] = useState(false)

    useEffect(() => {
        setIsMouted(true)
    }, [])

    if(!isMounted) return null

  return (
    <Modal title="Are you sure?" description="You can not recover stores once they are deleted." isOpen={isOpen} onClose={onClose}>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button onClick={onClose} disabled={loading} variant="outline">Cancel</Button>
            <Button onClick={onConfirm} disabled={loading} variant="destructive">Confirm</Button>
        </div>
    </Modal>
  )
}
