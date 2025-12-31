import { prisma } from '@/lib/prisma'
import { createProduct } from '@/app/admin/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save } from 'lucide-react'

export default async function NewProductPage() {
    const categories = await prisma.category.findMany()

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Add New Product</h1>
                <p className="text-gray-400">Create a new item in your inventory.</p>
            </div>

            <form action={createProduct} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-300">Product Name</label>
                        <Input name="name" placeholder="e.g. Arduino Uno R4" required className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Price (৳)</label>
                        <Input name="price" type="number" step="0.01" placeholder="0.00" required className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Stock Quantity</label>
                        <Input name="stock" type="number" placeholder="0" required className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-300">Category</label>
                        <select name="category" className="w-full h-10 px-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500">
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-800">{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-300">Image URL</label>
                        <Input name="imageUrl" placeholder="https://..." required className="bg-black/20 border-white/10" />
                        <p className="text-xs text-gray-500">Paste a direct link to an image (e.g. from Unsplash or Imgur).</p>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-sm font-medium text-gray-300">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            className="w-full p-3 rounded-md bg-black/20 border border-white/10 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent-500"
                            placeholder="Detailed product description..."
                        />
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" size="lg" className="bg-accent-500 text-black hover:bg-accent-600">
                        <Save className="w-4 h-4 mr-2" /> Save Product
                    </Button>
                </div>
            </form>
        </div>
    )
}
