import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Eye, ImageIcon } from 'lucide-react'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteProduct } from '@/app/admin/actions'

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

            <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
                {/* Prism Forge: Table Header Glow */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Preview</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Product Details</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Inventory</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Pricing</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <Plus className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p className="text-white/40 font-display font-medium">No products found in the forge yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-6">
                                            <div className="w-14 h-14 rounded-2xl bg-bg-void border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-lg group-hover:border-primary-500/40 transition-colors relative">
                                                {product.imageUrl ? (
                                                    <Image 
                                                        src={product.imageUrl} 
                                                        alt={product.name} 
                                                        fill 
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        sizes="56px"
                                                    />
                                                ) : (
                                                    <ImageIcon className="w-5 h-5 text-white/20" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="font-display font-black text-white text-lg group-hover:text-primary-400 transition-colors tracking-tight">
                                                    {product.name}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-500/60 bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/10">
                                                        {product.categoryName}
                                                    </span>
                                                    <span className="text-[10px] font-mono text-white/30 truncate max-w-[150px]">
                                                        {product.brandName || 'GENERIC-TECH'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center w-32">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 10 ? 'text-emerald-400' : product.stock > 0 ? 'text-amber-400' : 'text-rose-400'}`}>
                                                        {product.stock > 0 ? `${product.stock} IN STOCK` : 'DEPLETED'}
                                                    </span>
                                                    <span className="text-white/20 text-[10px] font-mono">
                                                        {Math.min(product.stock, 999)}
                                                    </span>
                                                </div>
                                                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full transition-all duration-1000 ${
                                                            product.stock > 10 ? 'bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 
                                                            product.stock > 0 ? 'bg-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.3)]' : 
                                                            'bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                                                        }`} 
                                                        style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col">
                                                <span className="text-white font-mono font-black text-xl tracking-tighter">
                                                    ৳{product.price.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                                                    NET VALUE
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                                <Link href={`/product/${product.slug}`} target="_blank">
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-xl border border-transparent hover:border-primary-500/20">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteButton
                                                    itemName={product.name}
                                                    action={async () => {
                                                        'use server'
                                                        await deleteProduct(product.id)
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
