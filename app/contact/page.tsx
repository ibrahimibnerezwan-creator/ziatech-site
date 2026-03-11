import { Footer } from '@/components/layout/footer'
import { getStoreSettings } from '@/lib/data'
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'

export default async function ContactPage() {
    const settings = await getStoreSettings()

    const address = settings['address'] || 'BCS Computer City, Agargaon, Dhaka, Bangladesh'
    const phone = settings['phone'] || '+880 1712-345678'
    const email = settings['email'] || 'support@ztech.com'
    const whatsapp = settings['whatsapp'] || '01712-345678'

    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
                <p className="text-lg text-gray-400 mb-12">Have a question or need help? Reach out to us through any of these channels.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
                        <Phone className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-white">Phone</h3>
                        <p className="text-gray-400">{phone}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
                        <MessageCircle className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-white">WhatsApp</h3>
                        <p className="text-gray-400">{whatsapp}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
                        <Mail className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-white">Email</h3>
                        <p className="text-gray-400">{email}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-3">
                        <MapPin className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-white">Visit Us</h3>
                        <p className="text-gray-400">{address}</p>
                    </div>
                </div>

                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-accent-400" />
                        <h3 className="text-xl font-bold text-white">Business Hours</h3>
                    </div>
                    <div className="text-gray-400 space-y-2">
                        <p>Saturday – Thursday: 10:00 AM – 8:00 PM</p>
                        <p>Friday: Closed</p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
