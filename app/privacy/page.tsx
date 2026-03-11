import { Footer } from '@/components/layout/footer'

export default function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <div className="container px-4 mx-auto py-12 flex-1 max-w-4xl">
                <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
                <p className="text-lg text-gray-400 mb-12">Last updated: March 2026</p>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8 text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Information We Collect</h2>
                        <p>When you use Z&apos;s Tech Shop, we may collect your name, email address, phone number, shipping address, and payment information necessary to process and deliver your orders.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">How We Use Your Information</h2>
                        <p>Your personal information is used solely to process orders, provide customer support, send order updates, and improve our services. We do not sell your data to third parties.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Data Security</h2>
                        <p>We implement industry-standard security measures to protect your personal information. All transactions are processed securely and your data is encrypted in transit.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Cookies</h2>
                        <p>We use essential cookies to maintain your session and shopping cart. We do not use tracking cookies for advertising purposes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
                        <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:support@ztech.com" className="text-accent-400 hover:underline">support@ztech.com</a>.</p>
                    </section>
                </div>
            </div>
            <Footer />
        </div>
    )
}
