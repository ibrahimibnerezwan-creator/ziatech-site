import { getStoreSettings } from '@/lib/data'
import { getCurrentUser } from '@/lib/auth'
import CheckoutClient from './checkout-client'

export const dynamic = 'force-dynamic'

export default async function CheckoutPage() {
    // Fetch settings to get bKash/Nagad numbers for the payment step
    const settings = await getStoreSettings()
    
    // Fetch user to prefill the shipping form if logged in
    const user = await getCurrentUser()

    return (
        <div className="min-h-screen pt-20 pb-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Checkout</h1>
                <CheckoutClient 
                    settings={settings} 
                    user={user} 
                />
            </div>
        </div>
    )
}
