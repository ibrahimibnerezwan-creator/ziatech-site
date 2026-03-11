import { getStoreSettings } from '@/lib/data'
import { updateSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Store, Phone, Mail, MapPin, MessageCircle, Share2, Server, CreditCard, Truck } from 'lucide-react'

export default async function SettingsPage() {
    const settings = await getStoreSettings()

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Store Settings</h1>
                <p className="text-gray-400">Manage your store's public contact details and view system connections.</p>
            </div>

            <form action={updateSettings} className="space-y-6">
                
                {/* Contact Information */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-accent-400 mb-6 pb-4 border-b border-white/10">
                        <Phone className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Contact Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="storeName" className="text-gray-300">Store Name</Label>
                            <Input id="storeName" name="storeName" defaultValue={settings.storeName || "Z's Tech Shop"} className="bg-black/20 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-gray-300">Phone Number</Label>
                            <Input id="phone" name="phone" defaultValue={settings.phone || "+880 1712-345678"} className="bg-black/20 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-gray-300">WhatsApp Number</Label>
                            <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp || "01712-345678"} className="bg-black/20 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-300">Support Email</Label>
                            <Input id="email" name="email" type="email" defaultValue={settings.email || "support@ztech.com"} className="bg-black/20 border-white/10 text-white" />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-gray-300">Physical Address</Label>
                            <Input id="address" name="address" defaultValue={settings.address || "BCS Computer City, Agargaon, Dhaka, Bangladesh"} className="bg-black/20 border-white/10 text-white" />
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-blue-400 mb-6 pb-4 border-b border-white/10">
                        <Share2 className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Social Media</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="facebook" className="text-gray-300">Facebook Page URL</Label>
                            <Input id="facebook" name="facebook" defaultValue={settings.facebook || "https://facebook.com/ztechshop"} className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-gray-300">Instagram URL</Label>
                            <Input id="instagram" name="instagram" defaultValue={settings.instagram} className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="youtube" className="text-gray-300">YouTube Channel URL</Label>
                            <Input id="youtube" name="youtube" defaultValue={settings.youtube} className="bg-black/20 border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tiktok" className="text-gray-300">TikTok URL</Label>
                            <Input id="tiktok" name="tiktok" defaultValue={settings.tiktok} className="bg-black/20 border-white/10 text-white" />
                        </div>
                    </div>
                </div>

                {/* Integration & Payments */}
                <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-md">
                    <div className="flex items-center space-x-2 text-emerald-400 mb-6 pb-4 border-b border-white/10">
                        <CreditCard className="w-5 h-5" />
                        <h2 className="text-xl font-bold">Integrations & Payments</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 p-4 border border-accent-500/30 rounded-lg bg-black/20">
                            <Label htmlFor="bkash_number" className="text-accent-400 font-bold block mb-1">bKash Number (Receive)</Label>
                            <Input id="bkash_number" name="bkash_number" placeholder="e.g. 01700000000" defaultValue={settings.bkash_number} className="bg-black/40 border-accent-500/50 text-white focus:ring-accent-500/50" />
                            <p className="text-xs text-gray-400 mt-2">Customers will send money to this number during checkout.</p>
                        </div>
                        <div className="space-y-2 p-4 border border-orange-500/30 rounded-lg bg-black/20">
                            <Label htmlFor="nagad_number" className="text-orange-400 font-bold block mb-1">Nagad Number (Receive)</Label>
                            <Input id="nagad_number" name="nagad_number" placeholder="e.g. 01700000000" defaultValue={settings.nagad_number} className="bg-black/40 border-orange-500/50 text-white focus:ring-orange-500/50" />
                            <p className="text-xs text-gray-400 mt-2">Customers will send money to this number during checkout.</p>
                        </div>

                        <div className="space-y-2 md:col-span-2 pt-4 border-t border-white/10 mt-2">
                            <div className="flex items-center space-x-2 mb-4">
                                <Truck className="w-4 h-4 text-gray-300" />
                                <h3 className="font-medium text-white">Steadfast Courier API</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="steadfast_api_key" className="text-gray-300">API Key</Label>
                                    <Input id="steadfast_api_key" name="steadfast_api_key" placeholder="Enter API Key" defaultValue={settings.steadfast_api_key} className="bg-black/20 border-white/10 text-white font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="steadfast_secret_key" className="text-gray-300">Secret Key</Label>
                                    <Input id="steadfast_secret_key" name="steadfast_secret_key" type="password" placeholder="Enter Secret Key" defaultValue={settings.steadfast_secret_key} className="bg-black/20 border-white/10 text-white font-mono text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
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
