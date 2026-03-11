"use client"

import React, { useState, useEffect } from 'react'
import { updateProduct } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ImageUpload } from '@/components/admin/image-upload'
import { Save, ChevronLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const id = params.id as string
    
    const [product, setProduct] = useState<any>(null)
    const [categories, setCategories] = useState<{id: string, name: string}[]>([])
    const [imageUrl, setImageUrl] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch(`/api/products/${id}`),
                    fetch('/api/categories')
                ])
                
                if (prodRes.ok && catRes.ok) {
                    const prodData = await prodRes.json()
                    const catData = await catRes.json()
                    setProduct(prodData)
                    setCategories(catData)
                    setImageUrl(prodData.images[0]?.url || '')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [id])

    const updateProductWithId = updateProduct.bind(null, id)

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-accent-500" /></div>
    if (!product) return <div className="text-center py-20 text-gray-400">Product not found</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <Link href="/admin/products" className="text-accent-400 flex items-center text-sm mb-2 hover:underline">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Products
                    </Link>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-tight">Edit <span className="text-accent-500">Product</span></h1>
                </div>
            </div>

            <form action={updateProductWithId} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6 bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Product Name</label>
                        <Input
                            name="name"
                            defaultValue={product.name}
                            placeholder="e.g. Arduino Uno R4"
                            required
                            className="bg-black/20 border-white/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Price (৳)</label>
                            <Input
                                name="price"
                                type="number"
                                step="0.01"
                                defaultValue={product.price}
                                placeholder="0.00"
                                required
                                className="bg-black/20 border-white/10"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Stock Quantity</label>
                            <Input
                                name="stock"
                                type="number"
                                defaultValue={product.stock}
                                placeholder="0"
                                required
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 uppercase tracking-wider">Category</label>
                        <select
                            name="category"
                            defaultValue={product.categoryId || ''}
                            className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500 appearance-none"
                        >
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
                            defaultValue={product.description}
                            className="w-full p-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                            placeholder="Describe performance, features, and specs..."
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl backdrop-blur-md">
                        <ImageUpload label="Update Image" onUploadComplete={(url) => setImageUrl(url)} />
                        <input type="hidden" name="imageUrl" value={imageUrl} />
                        {imageUrl && (
                            <p className="mt-2 text-[10px] text-green-400 font-mono break-all opacity-50 italic">
                                Connected to R2
                            </p>
                        )}
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest shadow-lg shadow-accent-500/20">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </div>
            </form>
        </div>
    )
}
