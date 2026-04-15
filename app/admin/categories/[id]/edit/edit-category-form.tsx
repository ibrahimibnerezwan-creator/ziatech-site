'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCategory } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/admin/image-upload'
import { Save, Loader2 } from 'lucide-react'

interface EditCategoryFormProps {
    category: {
        id: string
        name: string
        slug: string
        image: string | null
    }
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState(category.image || '')

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        formData.append('imageUrl', imageUrl)
        
        try {
            await updateCategory(category.id, formData)
        } catch (error) {
            console.error('Update failed:', error)
            setIsSubmitting(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-xl glass-card relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-amber-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Category Name</label>
                        <Input 
                            name="name" 
                            defaultValue={category.name}
                            required 
                            placeholder="e.g., Development Boards" 
                            className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-accent-500" 
                        />
                        <p className="text-xs text-gray-500 font-mono">Current Slug: {category.slug}</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <ImageUpload
                        onUploadComplete={(url) => setImageUrl(url)}
                        label="Category Image"
                        defaultValue={category.image || undefined}
                    />
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-mono truncate">
                        {imageUrl || 'Required: 800x800px recommended'}
                    </p>
                </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest px-8"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
