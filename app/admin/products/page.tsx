import Link from 'next/link'
import { getAllProducts } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

export default async function AdminProductsPage() {
    const products = await getAllProducts()

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Products</h1>
                    <p className="text-text-secondary">Manage your inventory and stock levels.</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-6 font-bold tracking-tight shadow-lg shadow-primary-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-bg-elevated/60 border border-primary-500/10 rounded-2xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-primary-500/5 text-text-muted text-xs uppercase tracking-widest font-display">
                        <tr>
                            <th className="p-5">Product Name</th>
                            <th className="p-5">Category</th>
                            <th className="p-5">Price</th>
                            <th className="p-5">Stock</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-500/5">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-text-muted">
                                    No products found. Build your first listing!
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="hover:bg-primary-500/5 transition-colors group">
                                    <td className="p-5">
                                        <div className="font-medium text-white group-hover:text-primary-400 transition-colors">{product.name}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-text-muted mt-0.5">{product.brandName || 'Store Brand'}</div>
                                    </td>
                                    <td className="p-5">
                                        <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/15 text-[11px] font-bold">
                                            {product.categoryName}
                                        </span>
                                    </td>
                                    <td className="p-5">
                                        <span className="text-white font-mono font-medium">৳{product.price.toLocaleString()}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex flex-col">
                                            <span className={`text-[11px] font-bold uppercase tracking-tighter ${product.stock > 10 ? 'text-emerald-400' : 'text-accent-400'}`}>
                                                {product.stock > 0 ? `${product.stock} Units` : 'Out of Stock'}
                                            </span>
                                            <div className="w-20 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${product.stock > 10 ? 'bg-emerald-500/40' : 'bg-accent-500/40'}`} 
                                                    style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <Link href={`/product/${product.slug}`} target="_blank">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-text-muted hover:text-white hover:bg-white/5 rounded-full">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-full">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                const { deleteProduct } = await import('@/app/admin/actions')
                                                await deleteProduct(product.id)
                                            }}>
                                                <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-accent-400 hover:text-accent-300 hover:bg-accent-500/10 rounded-full">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </form>
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
