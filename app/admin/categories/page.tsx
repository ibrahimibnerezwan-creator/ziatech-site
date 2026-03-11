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
                    <h1 className="text-3xl font-bold text-white">Categories</h1>
                    <p className="text-gray-400">Manage product categories and collections.</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="bg-accent-500 text-black hover:bg-accent-600 font-bold tracking-wide">
                        <Plus className="w-4 h-4 mr-2" /> Add Category
                    </Button>
                </Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden glass-card">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-20">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-center">Products</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500">
                                    <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">No categories found.</p>
                                    <p className="text-sm">Add your first category to start organizing products.</p>
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                            {category.image ? (
                                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-white text-lg">
                                        {category.name}
                                    </td>
                                    <td className="p-4 text-gray-400 font-mono text-sm">
                                        /{category.slug}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className="inline-flex items-center justify-center px-3 py-1 bg-accent-500/10 text-accent-400 border border-accent-500/20 rounded-full text-sm font-bold">
                                            {category.productCount}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link href={`/admin/categories/${category.id}/edit`}>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 text-yellow-500 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-full">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <form action={async () => {
                                                'use server'
                                                const { deleteCategory } = await import('@/app/admin/actions')
                                                await deleteCategory(category.id)
                                            }}>
                                                <Button type="submit" size="icon" variant="ghost" className="h-9 w-9 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full">
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
