import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOrderById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    CheckCircle2, 
    Clock, 
    User, 
    MapPin, 
    Phone, 
    CreditCard,
    Calendar,
    ArrowUpRight,
    Search
} from "lucide-react";
import { format } from "date-fns";

interface Props {
    params: { id: string };
}

export default async function OrderDetailPage({ params }: Props) {
    const { id } = await Promise.resolve(params);
    const order = await getOrderById(id);

    if (!order) {
        notFound();
    }

    const statusColors: Record<string, string> = {
        'PENDING': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        'PROCESSING': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
        'SHIPPED': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        'DELIVERED': 'text-primary-400 bg-primary-500/10 border-primary-500/10',
        'CANCELLED': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    };

    const statusIcons: Record<string, React.ElementType> = {
        'PENDING': Clock,
        'PROCESSING': Search,
        'SHIPPED': Truck,
        'DELIVERED': CheckCircle2,
        'CANCELLED': Package,
    };

    const StatusIcon = statusIcons[order.status] || Clock;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link 
                        href="/admin/orders" 
                        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary-400 transition-colors group mb-2"
                    >
                        <ChevronLeft className="w-3 h-3 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-display font-bold text-white tracking-tight">
                            Order <span className="text-primary-500 font-mono">#{order.id.slice(-8).toUpperCase()}</span>
                        </h1>
                        <div className={`px-3 py-1 rounded-full border ${statusColors[order.status]} text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5`}>
                            <StatusIcon className="w-3 h-3" />
                            {order.status}
                        </div>
                    </div>
                    <p className="text-white/40 flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        Placed on {format(new Date(order.createdAt), "PPP p")}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-6 font-bold uppercase tracking-widest text-xs h-11">
                        Print Invoice
                    </Button>
                    <Button className="bg-primary-500 text-white hover:bg-primary-600 rounded-full px-8 font-bold uppercase tracking-widest text-xs h-11 shadow-lg shadow-primary-500/20">
                        Update Status
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Items Card */}
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary-500" />
                                Order Items
                            </h2>
                            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
                                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>
                        <div className="divide-y divide-white/5">
                            {order.items.map((item) => (
                                <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-white/[0.02] transition-colors">
                                    <div className="w-20 h-20 rounded-2xl bg-bg-void border border-white/5 overflow-hidden flex-shrink-0 relative">
                                        <Image 
                                            src={item.product?.images[0]?.url || 'https://via.placeholder.com/200'} 
                                            alt={item.product?.name || 'Product'} 
                                            fill 
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="80px"
                                        />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-display font-bold text-white text-lg truncate group-hover:text-primary-400 transition-colors">
                                            {item.product?.name}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1">
                                            <p className="text-white/40 text-sm font-mono">
                                                Qty: <span className="text-white">{item.quantity}</span>
                                            </p>
                                            <p className="text-white/40 text-sm font-mono">
                                                Price: <span className="text-white">৳{item.price.toLocaleString()}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-white font-mono font-bold text-lg">
                                            ৳{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-8 bg-primary-500/5 mt-auto">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                                    <span className="text-white font-mono">৳{(order.total - order.deliveryCharge).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Delivery Charge</span>
                                    <span className="text-white font-mono">৳{order.deliveryCharge.toLocaleString()}</span>
                                </div>
                                <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-primary-400 font-display font-black uppercase tracking-tighter text-xl">Total Amount</span>
                                    <span className="text-primary-400 font-display font-black text-2xl tracking-tighter">
                                        ৳{order.total.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fulfillment Section */}
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                        <h2 className="text-lg font-display font-bold text-white flex items-center gap-2 mb-6">
                            <ArrowUpRight className="w-5 h-5 text-primary-500" />
                            Fulfillment Journey
                        </h2>
                        <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            <div className="relative pl-10">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center z-10">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                </div>
                                <h4 className="text-white font-bold text-sm">Order Created</h4>
                                <p className="text-white/40 text-xs mt-0.5">{format(new Date(order.createdAt), "PPP p")}</p>
                            </div>
                            <div className="relative pl-10 opacity-50">
                                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </div>
                                <h4 className="text-white font-bold text-sm">Fulfillment Processing</h4>
                                <p className="text-white/40 text-xs mt-0.5">Awaiting warehouse dispatch</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Information Cards */}
                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary-500/5 rounded-full blur-3xl group-hover:bg-primary-500/10 transition-colors" />
                        
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Customer Context
                        </h3>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5 text-primary-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-0.5">Name</p>
                                    <p className="text-white font-display font-medium text-lg leading-tight truncate">{order.customerName}</p>
                                    <p className="text-primary-500 text-[10px] font-bold uppercase tracking-tighter mt-1">Prism Member</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-sky-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-0.5">Contact</p>
                                    <p className="text-white font-mono text-sm tracking-tight">{order.customerPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/40 mb-0.5">Shipping Vector</p>
                                    <p className="text-white text-sm leading-relaxed">{order.address}</p>
                                    <p className="text-white/40 text-xs mt-1 font-bold">{order.shippingCity || 'Standard Delivery'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Context */}
                    <div className="bg-bg-elevated/40 border border-white/5 rounded-3xl p-6 backdrop-blur-xl transition-all hover:border-primary-500/20">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            Financial Intelligence
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Gateway</span>
                                    <span className="text-xs font-bold text-white uppercase">{order.paymentMethod || 'COD'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Status</span>
                                    <span className={`text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md ${order.paymentStatus === 'PAID' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                                        {order.paymentStatus || 'UNPAID'}
                                    </span>
                                </div>
                                {order.transactionId && (
                                    <div className="pt-2 border-t border-white/5">
                                        <p className="text-[10px] uppercase font-bold text-white/40 tracking-widest mb-1">TX Key</p>
                                        <p className="text-[11px] font-mono text-primary-300 break-all">{order.transactionId}</p>
                                    </div>
                                )}
                            </div>
                            
                            <Button variant="ghost" className="w-full text-white/40 hover:text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest h-9">
                                Manual Override
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
