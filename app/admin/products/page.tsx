import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            category: true,
            brand: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Products</h1>
                    <p className="text-gray-400">Manage your inventory.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-accent-500 text-black hover:bg-accent-600">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                        <tr>
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Category</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No products found. Add your first product!
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.brand?.name}</div>
                                    </td>
                                    <td className="p-4 text-gray-300">
                                        <span className="px-2 py-1 rounded-full bg-white/10 text-xs">
                                            {product.category?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white font-mono">৳{product.price}</td>
                                    <td className="p-4">
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {product.stock} in stock
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-400 hover:bg-blue-400/10">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-yellow-400 hover:bg-yellow-400/10">
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:bg-red-400/10">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
