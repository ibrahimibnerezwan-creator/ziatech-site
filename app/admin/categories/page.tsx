import Link from 'next/link'
import { getAllCategoriesWithCount } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, FolderOpen, Image as ImageIcon } from 'lucide-react'

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

            <div className="bg-bg-elevated/60 border border-primary-500/10 rounded-2xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-primary-500/5 text-text-muted text-xs uppercase tracking-widest font-display">
                        <tr>
                            <th className="p-5 w-24 text-center">Preview</th>
                            <th className="p-5">Category Name</th>
                            <th className="p-5">Route ID</th>
                            <th className="p-5 text-center">Items</th>
                            <th className="p-5 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-primary-500/5">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-16 text-center text-text-muted">
                                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg font-display font-medium">No collections yet</p>
                                    <p className="text-sm mt-1">Foundational groups help customers find specific tech.</p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-primary-500/5 transition-colors group">
                                    <td className="p-5">
                                        <div className="w-14 h-14 mx-auto rounded-xl bg-bg-void border border-primary-500/10 overflow-hidden flex items-center justify-center shrink-0 shadow-inner group-hover:border-primary-500/30 transition-colors">
                                            {category.image ? (
                                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-text-muted" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="font-display font-bold text-white text-lg group-hover:text-primary-400 transition-colors">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <code className="text-[11px] text-text-muted font-mono bg-bg-void px-2 py-1 rounded border border-white/5">
                                            /{category.slug}
                                        </code>
                                    </td>
                                    <td className="p-5 text-center">
                                        <span className="inline-flex items-center justify-center px-4 py-1 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-full text-xs font-bold shadow-sm">
                                            {category.productCount}
                                        </span>
                                    </td>
                                    <td className="p-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                            <Link href={`/admin/categories/${category.id}/edit`}>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-primary-400 hover:text-primary-300 hover:bg-primary-500/10 rounded-full">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                const { deleteCategory } = await import('@/app/admin/actions')
                                                await deleteCategory(category.id)
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
