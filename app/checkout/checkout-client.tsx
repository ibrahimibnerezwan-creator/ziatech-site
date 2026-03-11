"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { placeOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { CreditCard, Truck, Receipt, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'

interface Settings {
    [key: string]: string
}

interface User {
    id: string
    name: string
}

export default function CheckoutClient({ settings, user }: { settings: Settings, user?: User | null }) {
    const { items, totalPrice, clearCart } = useCart()
    const router = useRouter()
    const { toast } = useToast()

    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isLoading, setIsLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerPhone: '',
        address: '',
        shippingCity: 'Dhaka',
        paymentMethod: 'bkash', // bkash, nagad, cod
        transactionId: '',
    })

    const shippingCost = formData.shippingCity.toLowerCase() === 'dhaka' ? 60 : 120
    const finalTotal = totalPrice + shippingCost

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.customerName || !formData.customerPhone || !formData.address) {
                toast({ title: "Incomplete details", description: "Please fill out all shipping fields.", variant: "destructive" })
                return
            }
        }
        if (step === 2) {
            if (formData.paymentMethod !== 'cod' && !formData.transactionId) {
                toast({ title: "Missing Transaction ID", description: "Please provide the TrxID for your payment.", variant: "destructive" })
                return
            }
        }
        setStep(prev => (prev + 1) as 1 | 2 | 3)
    }

    const prevStep = () => setStep(prev => (prev - 1) as 1 | 2 | 3)

    const handleSubmit = async () => {
        setIsLoading(true)

        const result = await placeOrder({
            ...formData,
            items: items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
            total: finalTotal
        })

        if (result.error) {
            toast({ title: "Checkout Failed", description: result.error, variant: "destructive" })
            setIsLoading(false)
        } else {
            clearCart()
            toast({ title: "Order Placed!", description: "Your order has been received successfully." })
            router.push(`/order-confirmation/${result.orderId}`)
        }
    }

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-2xl glass-card">
                <Receipt className="w-16 h-16 text-gray-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">Cart is empty</h2>
                <Button onClick={() => router.push('/categories')} className="mt-4 bg-accent-500 text-black hover:bg-accent-600">
                    Return to Shop
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Area */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-8 bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className={`flex flex-col items-center ${step >= 1 ? 'text-accent-400' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 1 ? 'border-accent-400 bg-accent-400/10' : 'border-gray-600'}`}>
                            <Truck className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Shipping</span>
                    </div>
                    <div className={`h-1 flex-1 mx-4 rounded ${step >= 2 ? 'bg-accent-400' : 'bg-gray-700'}`} />
                    <div className={`flex flex-col items-center ${step >= 2 ? 'text-accent-400' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 2 ? 'border-accent-400 bg-accent-400/10' : 'border-gray-600'}`}>
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Payment</span>
                    </div>
                    <div className={`h-1 flex-1 mx-4 rounded ${step >= 3 ? 'bg-accent-400' : 'bg-gray-700'}`} />
                    <div className={`flex flex-col items-center ${step >= 3 ? 'text-accent-400' : 'text-gray-500'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step >= 3 ? 'border-accent-400 bg-accent-400/10' : 'border-gray-600'}`}>
                            <Receipt className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium">Review</span>
                    </div>
                </div>

                {/* STEP 1: SHIPPING */}
                {step === 1 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 glass-card animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-white mb-6">Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="customerName" className="text-gray-300">Full Name</Label>
                                <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="customerPhone" className="text-gray-300">Phone Number</Label>
                                <Input id="customerPhone" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleInputChange} className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="text-gray-300">Detailed Address (House, Road, Area)</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="bg-black/40 border-white/10 text-white focus:ring-accent-500/50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="shippingCity" className="text-gray-300">City / District</Label>
                                <select 
                                    id="shippingCity" 
                                    name="shippingCity" 
                                    value={formData.shippingCity} 
                                    onChange={handleInputChange} 
                                    className="w-full h-10 px-3 py-2 bg-black/40 border-white/10 text-white border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500/50"
                                >
                                    <option value="Dhaka">Dhaka City (৳60)</option>
                                    <option value="Outside Dhaka">Outside Dhaka (৳120)</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <Button onClick={nextStep} className="bg-accent-500 text-black hover:bg-accent-600 font-bold group">
                                Continue to Payment <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PAYMENT */}
                {step === 2 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 glass-card animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-white mb-6">Payment Method</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {/* bKash Option */}
                            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === 'bkash' ? 'border-[#e2136e] bg-[#e2136e]/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="paymentMethod" value="bkash" checked={formData.paymentMethod === 'bkash'} onChange={handleInputChange} className="sr-only" />
                                <div className="w-12 h-12 bg-[#e2136e] rounded flex items-center justify-center font-bold text-white text-xs">bKash</div>
                                <span className="text-white font-medium">bKash</span>
                            </label>

                            {/* Nagad Option */}
                            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === 'nagad' ? 'border-[#f37021] bg-[#f37021]/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="paymentMethod" value="nagad" checked={formData.paymentMethod === 'nagad'} onChange={handleInputChange} className="sr-only" />
                                <div className="w-12 h-12 bg-[#f37021] rounded flex items-center justify-center font-bold text-white text-xs">Nagad</div>
                                <span className="text-white font-medium">Nagad</span>
                            </label>

                            {/* COD Option */}
                            <label className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${formData.paymentMethod === 'cod' ? 'border-accent-400 bg-accent-400/10' : 'border-white/10 bg-black/40 hover:border-white/30'}`}>
                                <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="sr-only" />
                                <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center text-white"><Truck className="w-6 h-6" /></div>
                                <span className="text-white font-medium text-center">Cash on<br/>Delivery</span>
                            </label>
                        </div>

                        {/* Payment Instructions Based on Selection */}
                        <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-6">
                            {formData.paymentMethod === 'bkash' && (
                                <div className="space-y-4">
                                    <h3 className="text-[#e2136e] font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> bkash Payment Instructions</h3>
                                    <p className="text-gray-300 text-sm">1. Go to your bKash app and select <strong>Send Money</strong>.</p>
                                    <p className="text-gray-300 text-sm">2. Enter our number: <strong className="text-white text-lg tracking-widest bg-white/10 px-2 py-1 rounded inline-block">{settings.bkash_number || 'N/A'}</strong></p>
                                    <p className="text-gray-300 text-sm">3. Enter the total amount: <strong className="text-white">৳{finalTotal.toLocaleString()}</strong></p>
                                    <p className="text-gray-300 text-sm">4. Enter the TrxID below to confirm your order.</p>
                                    
                                    <div className="mt-4">
                                        <Label htmlFor="transactionId" className="text-gray-300">bKash Transaction ID (TrxID)</Label>
                                        <Input id="transactionId" name="transactionId" placeholder="e.g. 9J2A4HRXZ" value={formData.transactionId} onChange={handleInputChange} className="mt-1 bg-black/60 border-[#e2136e]/30 text-white focus:ring-[#e2136e]/50 uppercase" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'nagad' && (
                                <div className="space-y-4">
                                    <h3 className="text-[#f37021] font-bold flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Nagad Payment Instructions</h3>
                                    <p className="text-gray-300 text-sm">1. Go to your Nagad app and select <strong>Send Money</strong>.</p>
                                    <p className="text-gray-300 text-sm">2. Enter our number: <strong className="text-white text-lg tracking-widest bg-white/10 px-2 py-1 rounded inline-block">{settings.nagad_number || 'N/A'}</strong></p>
                                    <p className="text-gray-300 text-sm">3. Enter the total amount: <strong className="text-white">৳{finalTotal.toLocaleString()}</strong></p>
                                    <p className="text-gray-300 text-sm">4. Enter the TrxID below to confirm your order.</p>
                                    
                                    <div className="mt-4">
                                        <Label htmlFor="transactionId" className="text-gray-300">Nagad Transaction ID (TrxID)</Label>
                                        <Input id="transactionId" name="transactionId" placeholder="e.g. 7XYZ9ABC" value={formData.transactionId} onChange={handleInputChange} className="mt-1 bg-black/60 border-[#f37021]/30 text-white focus:ring-[#f37021]/50 uppercase" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'cod' && (
                                <div className="space-y-2 text-center py-4">
                                    <Truck className="w-12 h-12 text-accent-400 mx-auto mb-4 opacity-50" />
                                    <h3 className="text-accent-400 font-bold text-lg">Cash on Delivery Available</h3>
                                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                                        You will pay <strong>৳{finalTotal.toLocaleString()}</strong> directly to the Steadfast delivery rider when your package arrives.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Button variant="ghost" onClick={prevStep} className="text-gray-400 hover:text-white group">
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                            </Button>
                            <Button onClick={nextStep} className="bg-accent-500 text-black hover:bg-accent-600 font-bold group">
                                Review Order <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                    <div className="bg-white/5 border border-white/10 rounded-xl p-6 glass-card animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-bold text-white mb-6">Review & Confirm</h2>
                        
                        <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Delivery Details</h3>
                            <p className="text-white font-medium">{formData.customerName}</p>
                            <p className="text-gray-300">{formData.customerPhone}</p>
                            <p className="text-gray-300">{formData.address}, {formData.shippingCity}</p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-lg border border-white/5 mb-6">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 border-b border-white/10 pb-2">Payment Details</h3>
                            <p className="text-white font-medium capitalize flex items-center gap-2">
                                Method: <span className={`px-2 py-0.5 rounded text-xs font-bold ${formData.paymentMethod === 'bkash' ? 'bg-[#e2136e]/20 text-[#e2136e]' : formData.paymentMethod === 'nagad' ? 'bg-[#f37021]/20 text-[#f37021]' : 'bg-accent-400/20 text-accent-400'}`}>
                                    {formData.paymentMethod}
                                </span>
                            </p>
                            {formData.transactionId && <p className="text-gray-300 mt-1">TrxID: <span className="font-mono text-white">{formData.transactionId.toUpperCase()}</span></p>}
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Button variant="ghost" onClick={prevStep} disabled={isLoading} className="text-gray-400 hover:text-white group">
                                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading} className="bg-accent-500 text-black hover:bg-accent-600 font-bold text-lg px-8">
                                {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : "Confirm Order"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Summary Sidebar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit sticky top-24 glass-card">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map(item => (
                        <div key={item.id} className="flex gap-3 text-sm">
                            <div className="relative w-12 h-12 bg-white/5 rounded overlow-hidden shrink-0">
                                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover rounded" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{item.name}</p>
                                <p className="text-gray-400 transition-colors">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-white font-medium">৳{(item.price * item.quantity).toLocaleString()}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 text-sm border-t border-white/10 pt-4">
                    <div className="flex justify-between text-gray-400">
                        <span>Subtotal ({items.length} items)</span>
                        <span className="text-white">৳{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Shipping ({formData.shippingCity})</span>
                        <span className="text-white">৳{shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-white/10 mt-3 pt-3 flex justify-between text-lg">
                        <span className="font-bold text-white">Total</span>
                        <span className="font-bold text-accent-400">৳{finalTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
