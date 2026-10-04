import { getAllCategoriesWithCount, getStoreSettings } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import { HeaderClient } from './header-client'

export async function Header() {
  const [categories, user, settings] = await Promise.all([
    getAllCategoriesWithCount(), getCurrentUser(), getStoreSettings(),
  ])
  return <HeaderClient categories={categories} user={user} phone={settings.phone || settings.whatsapp || ''} />
}
