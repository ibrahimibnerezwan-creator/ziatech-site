'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCategory } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/ui/image-upload'
import { ArrowLeft, Plus } from 'lucide-react'

export default function NewCategoryPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageUrl, setImageUrl] = useState('')

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        formData.append('imageUrl', imageUrl)
        
        await createCategory(formData)
        // Router push/refresh happens inside the server action via redirect()
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <Link href="/admin/categories">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">New Category</h1>
                    <p className="text-gray-400">Create a new product collection.</p>
                </div>
            </div>

            <form action={handleSubmit} className="space-y-8 bg-white/5 border border-white/10 p-8 rounded-xl glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-500 to-purple-500"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Category Name</label>
                            <Input 
                                name="name" 
                                required 
                                placeholder="e.g., Development Boards" 
                                className="bg-black/20 border-white/10 text-white placeholder:text-gray-600 focus:border-accent-500" 
                            />
                            <p className="text-xs text-gray-500">The slug will be automatically generated from the name.</p>
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
                        <p className="text-xs text-gray-500 mt-2">Recommended: 800x800px square image.</p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest px-8"
                    >
                        {isSubmitting ? 'Creating...' : (
                            <>
                                <Plus className="w-4 h-4 mr-2" /> Create Category
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    )
}
