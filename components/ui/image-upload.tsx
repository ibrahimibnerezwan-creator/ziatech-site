"use client"

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud, X, Loader2, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove: () => void;
    className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsUploading(true)

        try {
            // Use the existing R2 upload route or standard form logic here
            const formData = new FormData()
            formData.append('file', file)

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })

            const data = await response.json()

            if (data.url) {
                onChange(data.url)
            } else {
                throw new Error(data.message || 'Upload failed')
            }
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Failed to upload image. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }, [onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        maxFiles: 1,
        disabled: isUploading || !!value
    })

    if (value) {
        return (
            <div className={cn("relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 group", className)}>
                <img
                    src={value}
                    alt="Upload preview"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button
                        type="button"
                        onClick={onRemove}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-3 rounded-full transition-colors flex flex-col items-center"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "relative w-full aspect-video rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors hover:bg-white/5",
                isDragActive && "border-accent-500 bg-accent-500/10",
                isUploading && "pointer-events-none opacity-50",
                className
            )}
        >
            <input {...getInputProps()} />
            
            {isUploading ? (
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-accent-400 animate-spin mb-4" />
                    <p className="text-sm text-gray-400 font-medium">Uploading to R2...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-white/10 bg-black/40 flex items-center justify-center mb-4 text-gray-400">
                        <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-white font-medium mb-1">
                        {isDragActive ? "Drop image here" : "Click or drag to upload"}
                    </p>
                    <p className="text-xs text-gray-500 max-w-[200px]">
                        Supports JPG, PNG and WEBP. High resolution recommended.
                    </p>
                </div>
            )}
        </div>
    )
}
