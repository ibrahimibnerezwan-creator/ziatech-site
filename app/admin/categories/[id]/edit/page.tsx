import { getCategoryById } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import EditCategoryForm from './edit-category-form'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const category = await getCategoryById(id)

    if (!category) {
        notFound()
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
                    <h1 className="text-3xl font-bold text-white">Edit Category</h1>
                    <p className="text-gray-400">Update collection details.</p>
                </div>
            </div>

            <EditCategoryForm category={category} />
        </div>
    )
}
