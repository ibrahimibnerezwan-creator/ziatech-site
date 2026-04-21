import Link from 'next/link'
import Image from 'next/image'
import { getAllCategoriesWithCount } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Plus, Edit, FolderOpen, Image as ImageIcon } from 'lucide-react'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteCategory } from '@/app/admin/actions'

export default async function AdminCategoriesPage() {
    const categories = await getAllCategoriesWithCount()

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Categories</h1>
                    <p className="text-text-secondary">Organize your inventory into collections.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-6 font-bold tracking-tight shadow-lg shadow-primary-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Identity</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Connection</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-center">Volume</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                <FolderOpen className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p className="text-white/40 font-display font-medium">No system categories forged yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                categories.map((category) => (
                                    <tr key={category.id} className="hover:bg-white/[0.02] transition-all group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-bg-void border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-lg group-hover:border-primary-500/40 transition-colors relative">
                                                    {category.image ? (
                                                        <Image 
                                                            src={category.image} 
                                                            alt={category.name} 
                                                            fill 
                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                            sizes="64px"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-white/20" />
                                                    )}
                                                </div>
                                                <div className="font-display font-black text-white text-2xl group-hover:text-primary-400 transition-colors tracking-tighter">
                                                    {category.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <code className="text-[11px] text-white/30 font-mono bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 tracking-wider uppercase">
                                                /{category.slug}
                                            </code>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-white font-mono font-black text-xl tracking-tighter shadow-primary-500/10">
                                                    {category.productCount}
                                                </span>
                                                <span className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                                                    ITEMS
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 transition-all duration-300">
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <Button size="icon" variant="ghost" className="h-10 w-10 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-xl border border-transparent hover:border-primary-500/20">
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteButton
                                                    itemName={category.name}
                                                    action={async () => {
                                                        'use server'
                                                        await deleteCategory(category.id)
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
