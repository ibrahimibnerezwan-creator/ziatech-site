import { getStoreSettings } from '@/lib/data'
import { MapPin, Phone, Mail, MessageCircle, Clock } from 'lucide-react'

export default async function ContactPage() {
    const settings = await getStoreSettings()

    const address = settings['address'] || 'BCS Computer City, Agargaon, Dhaka, Bangladesh'
    const phone = settings['phone'] || '+880 1712-345678'
    const email = settings['email'] || 'support@ztech.com'
    const whatsapp = settings['whatsapp'] || '01712-345678'

    return (
        <div className="min-h-[60vh] flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-bold text-text-primary mb-4">Contact Us</h1>
                <p className="text-lg text-text-secondary mb-12">Have a question or need help? Reach out to us through any of these channels.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-bg-elevated border border-line rounded-2xl p-8 space-y-3">
                        <Phone className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-text-primary">Phone</h3>
                        <a className="text-primary-400 underline" href={`tel:${phone.replace(/\D/g, '')}`}>{phone}</a>
                    </div>
                    <div className="bg-bg-elevated border border-line rounded-2xl p-8 space-y-3">
                        <MessageCircle className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-text-primary">WhatsApp</h3>
                        <a className="text-primary-400 underline" href={`https://wa.me/${whatsapp.replace(/\D/g, '').replace(/^0/, '880')}`} target="_blank" rel="noopener noreferrer">{whatsapp}</a>
                    </div>
                    <div className="bg-bg-elevated border border-line rounded-2xl p-8 space-y-3">
                        <Mail className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-text-primary">Email</h3>
                        <a className="text-primary-400 underline" href={`mailto:${email}`}>{email}</a>
                    </div>
                    <div className="bg-bg-elevated border border-line rounded-2xl p-8 space-y-3">
                        <MapPin className="w-8 h-8 text-accent-400" />
                        <h3 className="text-xl font-bold text-text-primary">Visit Us</h3>
                        <p className="text-text-secondary">{address}</p>
                    </div>
                </div>

                <div className="mt-8 bg-bg-elevated border border-line rounded-2xl p-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <Clock className="w-6 h-6 text-accent-400" />
                        <h3 className="text-xl font-bold text-text-primary">Business Hours</h3>
                    </div>
                    <div className="text-text-secondary space-y-2">
                        <p>Saturday – Thursday: 10:00 AM – 8:00 PM</p>
                        <p>Friday: Closed</p>
                    </div>
                </div>
            </div>

        </div>
    )
}
