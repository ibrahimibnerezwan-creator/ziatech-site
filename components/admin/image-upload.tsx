"use client"

import React, { useState } from 'react'
import { Image as ImageIcon, X, UploadCloud, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploadProps {
    onUploadComplete: (url: string) => void
    label?: string
    defaultValue?: string
}

export function ImageUpload({ onUploadComplete, label = "Upload Product Image", defaultValue }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(defaultValue || null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)

        try {
            // 1. Get pre-signed URL
            const urlRes = await fetch('/api/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                }),
            })
            const { uploadUrl, publicUrl } = await urlRes.json()

            // 2. Upload to R2
            await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            })

            setPreview(publicUrl)
            onUploadComplete(publicUrl)
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Upload failed. Check your Cloudflare credentials.')
        } finally {
            setIsUploading(false)
        }
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            
            {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                    <button
                        type="button"
                        onClick={() => { setPreview(null); onUploadComplete(''); }}
                        className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/10 rounded-lg cursor-pointer bg-black/20 hover:bg-black/30 transition-all hover:border-accent-500/50 group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-accent-500 animate-spin mb-2" />
                        ) : (
                            <UploadCloud className="w-8 h-8 text-gray-400 group-hover:text-accent-400 mb-2 transition-colors" />
                        )}
                        <p className="text-sm text-gray-400 group-hover:text-gray-300">
                            {isUploading ? 'Uploading to R2...' : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Max 5MB</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={isUploading} />
                </label>
            )}
        </div>
    )
}
