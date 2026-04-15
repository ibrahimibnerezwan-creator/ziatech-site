"use client"

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DeleteButtonProps {
    action: () => Promise<void>
    itemName: string
}

export function DeleteButton({ action, itemName }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Delete "${itemName}"? This cannot be undone.`)) return
        setIsDeleting(true)
        try {
            await action()
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl border border-transparent hover:border-rose-500/20"
            onClick={handleDelete}
            disabled={isDeleting}
        >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </Button>
    )
}
