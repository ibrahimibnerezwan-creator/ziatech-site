import { ArrowUpRight, CircuitBoard, Cpu, Layers } from 'lucide-react'
import Link from 'next/link'

type CategoryItem = { id: string; slug: string; name: string; productCount: number; image?: string | null }

export function CategoryGridClient({ categories }: { categories: CategoryItem[] }) {
  return <div className="category-shortcuts">
    {categories.map(category => {
      const Icon = /micro|controller|\bics?\b/i.test(category.name) ? Cpu : /electronic/i.test(category.name) ? CircuitBoard : Layers
      return <Link key={category.id} href={`/category/${category.slug}`} className="category-shortcut">
        <span className="category-symbol"><Icon size={29} strokeWidth={1.4} /></span>
        <span><strong>{category.name}</strong><small>{category.productCount} {category.productCount === 1 ? 'component' : 'components'}</small></span>
        <ArrowUpRight size={20} className="category-arrow" />
      </Link>
    })}
  </div>
}
