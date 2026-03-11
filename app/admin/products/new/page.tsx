"use client"

import React, { useState, useEffect } from 'react'
import { createProduct } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/admin/image-upload'
import { Save, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewProductPage() {
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])
    const [imageUrl, setImageUrl] = useState('')

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories')
                if (res.ok) {
                    const data = await res.json()
                    setCategories(data)
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error)
            }
        }
        fetchCategories()
    }, [])

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/admin/products" className="text-accent-400 flex items-center text-sm mb-2 hover:underline">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Add New <span className="text-accent-500">Product</span></h1>
                </div>
            </div>

            <form action={createProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Product Name</label>
                        <Input name="name" placeholder="e.g. Arduino Uno R4" required className="bg-black/20 border-white/10" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Price (৳)</label>
                            <Input name="price" type="number" step="0.01" placeholder="0.00" required className="bg-black/20 border-white/10" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Stock Quantity</label>
                            <Input name="stock" type="number" placeholder="0" required className="bg-black/20 border-white/10" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Category</label>
                        <select name="category" className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none">
                            <option value="" className="bg-gray-800">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-800">{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Description</label>
                        <textarea
                            name="description"
                            rows={6}
                            className="w-full p-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                            placeholder="Describe performance, features, and specs..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <ImageUpload onUploadComplete={(url) => setImageUrl(url)} />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                        {imageUrl && (
                            <p className="mt-2 text-[10px] text-green-400 font-mono break-all opacity-50">
                                {imageUrl}
                            </p>
                        )}
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest shadow-lg shadow-accent-500/20">
                        <Save className="w-4 h-4 mr-2" /> Save Product
                    </Button>
                </div>
            </form>
        </div>
    )
}
