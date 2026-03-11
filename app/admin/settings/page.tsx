import { getStoreSettings } from '@/lib/data'
import { updateSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Save, Store, Phone, Mail, MapPin, MessageCircle, Share2, Server } from 'lucide-react'

export default async function SettingsPage() {
    const settings = await getStoreSettings()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Store Settings</h1>
                <p className="text-gray-400">Manage your store's public contact details and view system connections.</p>
            </div>

            <form action={updateSettings} className="space-y-6 bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                <div className="flex items-center space-x-2 text-accent-400 mb-6 pb-4 border-b border-white/10">
                    <Store className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Public Contact Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Store className="w-4 h-4 text-gray-400" /> Store Name
                        </label>
                        <Input name="storeName" defaultValue={settings['storeName'] || "Z's Tech Shop"} className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" /> Phone Number
                        </label>
                        <Input name="phone" defaultValue={settings['phone'] || "+880 1712-345678"} className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-gray-400" /> WhatsApp
                        </label>
                        <Input name="whatsapp" defaultValue={settings['whatsapp'] || "01712-345678"} className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" /> Support Email
                        </label>
                        <Input name="email" type="email" defaultValue={settings['email'] || "support@ztech.com"} className="bg-black/20 border-white/10" />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" /> Physical Address
                        </label>
                        <Input name="address" defaultValue={settings['address'] || "BCS Computer City, Agargaon, Dhaka, Bangladesh"} className="bg-black/20 border-white/10" />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Share2 className="w-4 h-4 text-gray-400" /> Facebook Page URL
                        </label>
                        <Input name="facebook" defaultValue={settings['facebook'] || "https://facebook.com/ztechshop"} className="bg-black/20 border-white/10" />
                    </div>
                </div>

                <div className="pt-6">
                    <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent-500 text-black hover:bg-accent-600 font-bold uppercase tracking-widest">
                        <Save className="w-4 h-4 mr-2" /> Save Settings
                    </Button>
                </div>
            </form>

            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                <div className="flex items-center space-x-2 text-emerald-400 mb-6 pb-4 border-b border-white/10">
                    <Server className="w-5 h-5" />
                    <h2 className="text-xl font-bold">System Status</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg border border-white/5">
                        <div>
                            <p className="font-bold text-white">Database</p>
                            <p className="text-xs text-gray-500">Turso libSQL</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">Connected</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-black/20 rounded-lg border border-white/5">
                        <div>
                            <p className="font-bold text-white">Image Storage</p>
                            <p className="text-xs text-gray-500">Cloudflare R2</p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">Connected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
