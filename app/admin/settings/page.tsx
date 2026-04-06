import { getStoreSettings } from '@/lib/data'
import { updateSettings } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save, Store, Phone, Mail, MapPin, MessageCircle, Share2, Server, CreditCard, Truck } from 'lucide-react'

export default async function SettingsPage() {
    const settings = await getStoreSettings()

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-display font-bold text-white mb-3">Core Parameters</h1>
                <p className="text-text-secondary">Calibrate the foundational logic and identity of ZiaTech.</p>
            </div>

            <form action={updateSettings} className="space-y-8">
                
                {/* Contact Information */}
                <div className="bg-bg-elevated/60 border border-primary-500/10 p-8 rounded-3xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary-500/10 transition-colors" />
                    
                    <div className="flex items-center space-x-3 text-primary-400 mb-8 pb-4 border-b border-white/5">
                        <Store className="w-5 h-5" />
                        <h2 className="text-xl font-display font-bold text-white">Identity & Reach</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <Label htmlFor="storeName" className="text-xs uppercase tracking-widest text-text-muted font-bold ml-1">Establishment Name</Label>
                            <Input id="storeName" name="storeName" defaultValue={settings.storeName || "ZiaTech Prism"} className="bg-bg-void/50 border-primary-500/10 text-white rounded-xl focus:border-primary-500/40 focus:ring-primary-500/10 h-12" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-xs uppercase tracking-widest text-text-muted font-bold ml-1">Voice Comm Line</Label>
                            <Input id="phone" name="phone" defaultValue={settings.phone || "+880 1712-345678"} className="bg-bg-void/50 border-primary-500/10 text-white rounded-xl focus:border-primary-500/40 focus:ring-primary-500/10 h-12" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="whatsapp" className="text-xs uppercase tracking-widest text-text-muted font-bold ml-1">Direct Matrix (WhatsApp)</Label>
                            <div className="relative">
                                <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp || "01712-345678"} className="bg-bg-void/50 border-primary-500/10 text-white rounded-xl focus:border-primary-500/40 focus:ring-primary-500/10 h-12 pl-12" />
                                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500/50" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-text-muted font-bold ml-1">Neural Ingress (Email)</Label>
                            <div className="relative">
                                <Input id="email" name="email" type="email" defaultValue={settings.email || "support@ziatech.com"} className="bg-bg-void/50 border-primary-500/10 text-white rounded-xl focus:border-primary-500/40 focus:ring-primary-500/10 h-12 pl-12" />
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500/50" />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="text-xs uppercase tracking-widest text-text-muted font-bold ml-1">Geographic Coordinates</Label>
                            <div className="relative">
                                <Input id="address" name="address" defaultValue={settings.address || "Agargaon, Dhaka, Bangladesh"} className="bg-bg-void/50 border-primary-500/10 text-white rounded-xl focus:border-primary-500/40 focus:ring-primary-500/10 h-12 pl-12" />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-500/50" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-bg-elevated/60 border border-primary-500/10 p-8 rounded-3xl backdrop-blur-xl group">
                    <div className="flex items-center space-x-3 text-primary-400 mb-8 pb-4 border-b border-white/5">
                        <Share2 className="w-5 h-5" />
                        <h2 className="text-xl font-display font-bold text-white">Social Grid Connections</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {['facebook', 'instagram', 'youtube', 'tiktok'].map((platform) => (
                            <div key={platform} className="space-y-2">
                                <Label htmlFor={platform} className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold ml-1">{platform} node</Label>
                                <Input 
                                    id={platform} 
                                    name={platform} 
                                    placeholder={`https://${platform}.com/...`}
                                    defaultValue={settings[platform as keyof typeof settings]} 
                                    className="bg-bg-void/50 border-primary-500/5 text-white rounded-xl focus:border-primary-500/40 h-12 font-mono text-xs" 
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Integration & Payments */}
                <div className="bg-bg-elevated/60 border border-primary-500/10 p-8 rounded-3xl backdrop-blur-xl">
                    <div className="flex items-center space-x-3 text-primary-400 mb-8 pb-4 border-b border-white/5">
                        <CreditCard className="w-5 h-5" />
                        <h2 className="text-xl font-display font-bold text-white">Transaction Protocols</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-bg-void/40 border border-primary-500/20 shadow-inner group/pay">
                            <Label htmlFor="bkash_number" className="text-[10px] uppercase tracking-widest text-primary-400 font-bold block mb-3 group-hover/pay:text-primary-300 transition-colors">bKash Terminal</Label>
                            <Input id="bkash_number" name="bkash_number" placeholder="017XXXXXXXX" defaultValue={settings.bkash_number} className="bg-bg-void border-primary-500/30 text-white focus:border-primary-500 h-12 font-mono" />
                            <p className="text-[10px] text-text-muted mt-3 italic">"Secure molten amber flows."</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-bg-void/40 border border-accent-500/20 shadow-inner group/pay">
                            <Label htmlFor="nagad_number" className="text-[10px] uppercase tracking-widest text-accent-400 font-bold block mb-3 group-hover/pay:text-accent-300 transition-colors">Nagad Portal</Label>
                            <Input id="nagad_number" name="nagad_number" placeholder="017XXXXXXXX" defaultValue={settings.nagad_number} className="bg-bg-void border-accent-500/30 text-white focus:border-accent-500 h-12 font-mono" />
                            <p className="text-[10px] text-text-muted mt-3 italic">"Rapid essence transference."</p>
                        </div>

                        <div className="md:col-span-2 pt-6 mt-2 border-t border-white/5">
                            <div className="flex items-center space-x-2 mb-6">
                                <Truck className="w-4 h-4 text-primary-500" />
                                <h3 className="font-display font-bold text-white">Logistic Link (Steadfast)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="steadfast_api_key" className="text-xs text-text-muted ml-1">API Key</Label>
                                    <Input id="steadfast_api_key" name="steadfast_api_key" type="password" placeholder="••••••••••••" defaultValue={settings.steadfast_api_key} className="bg-bg-void/50 border-white/5 text-white h-12 font-mono text-sm" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="steadfast_secret_key" className="text-xs text-text-muted ml-1">Secret Signature</Label>
                                    <Input id="steadfast_secret_key" name="steadfast_secret_key" type="password" placeholder="••••••••••••" defaultValue={settings.steadfast_secret_key} className="bg-bg-void/50 border-white/5 text-white h-12 font-mono text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4 flex justify-center md:justify-start">
                    <Button type="submit" size="lg" className="h-14 px-12 bg-primary-500 text-white hover:bg-primary-600 rounded-full font-display font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 group transform hover:scale-105 transition-all">
                        <Save className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" /> 
                        Commit Changes
                    </Button>
                </div>
            </form>

            <div className="bg-bg-elevated/40 border border-white/5 p-8 rounded-3xl">
                <div className="flex items-center space-x-3 text-primary-400/50 mb-8 pb-4 border-b border-white/5">
                    <Server className="w-5 h-5" />
                    <h2 className="text-xl font-display font-bold text-white/80">Infrastructure Pulse</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex justify-between items-center p-5 bg-bg-void/50 rounded-2xl border border-primary-500/5 group hover:border-primary-500/20 transition-colors">
                        <div>
                            <p className="font-display font-bold text-white group-hover:text-primary-400 transition-colors">Neural Core (DB)</p>
                            <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">Turso Edge v2.1</p>
                        </div>
                        <div className="flex items-center space-x-2 text-primary-400 font-bold text-[10px] uppercase tracking-widest bg-primary-500/5 px-4 py-2 rounded-full border border-primary-500/10">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            <span>Synchronized</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center p-5 bg-bg-void/50 rounded-2xl border border-primary-500/5 group hover:border-primary-500/20 transition-colors">
                        <div>
                            <p className="font-display font-bold text-white group-hover:text-primary-400 transition-colors">Visual Matrix (CDN)</p>
                            <p className="text-[10px] uppercase tracking-widest text-text-muted mt-1">Cloudflare R2 Instance</p>
                        </div>
                        <div className="flex items-center space-x-2 text-primary-400 font-bold text-[10px] uppercase tracking-widest bg-primary-500/5 px-4 py-2 rounded-full border border-primary-500/10">
                            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                            <span>Linked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
