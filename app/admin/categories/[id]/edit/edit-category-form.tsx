'use client'

import { useState } from 'react'
import { updateCategory } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'
import { Save } from 'lucide-react'

interface EditCategoryFormProps {
    category: {
        id: string;
        name: string;
        slug: string;
        image: string | null;
    }
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState(category.image || '')

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        formData.append('imageUrl', imageUrl)
        
        await updateCategory(category.id, formData)
    }

    return (
        <form action={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-xl glass-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-purple-500"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Category Name</label>
                        <Input 
                            name="name" 
                            required 
                            defaultValue={category.name}
                            className="bg-black/20 border-white/10 text-white focus:border-accent-500" 
                        />
                        <p className="text-xs text-gray-500">Current slug: <span className="font-mono text-gray-400">/{category.slug}</span></p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 block mb-2">Category Image</label>
                    <ImageUpload
                        value={imageUrl}
                        onChange={(url) => setImageUrl(url)}
                        onRemove={() => setImageUrl('')}
                        className="bg-black/20 border-white/10"
                    />
                </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex justify-end">
                <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest px-8"
                >
                    {isSubmitting ? 'Saving...' : (
                        <>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </>
                    )}
                </Button>
            </div>
        </form>
    )
}
