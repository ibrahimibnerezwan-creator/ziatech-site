"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, CheckCircle2, Loader2, Truck, ShieldCheck, Zap, MessageCircle } from "lucide-react";

export interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  stock?: number;
}

interface CheckoutModalProps {
  product: CheckoutProduct;
  initialQuantity?: number;
  onClose: () => void;
}

export function CheckoutModal({ product, initialQuantity = 1, onClose }: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ orderId: string; invoice: string; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [qty, setQty] = useState(initialQuantity);
  const [deliveryZone, setDeliveryZone] = useState<"dhaka" | "suburb" | "outside">("dhaka");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod" as "cod" | "bkash" | "nagad",
    trxId: "",
  });
  const [honeypot, setHoneypot] = useState("");

  useEffect(() => {
    setMounted(true);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const deliveryCharge = deliveryZone === "dhaka" ? 60 : deliveryZone === "suburb" ? 100 : 120;
  const productTotal = product.price * qty;
  const grandTotal = productTotal + deliveryCharge;

  const cityName =
    deliveryZone === "dhaka"
      ? "Dhaka"
      : deliveryZone === "suburb"
      ? "Dhaka Suburbs (Gazipur/Savar/Narayanganj)"
      : "Outside Dhaka";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const cleanPhone = formData.phone.replace(/\D/g, "");
    if (!/^(01|8801)\d{9}$/.test(cleanPhone)) {
      setError("অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)");
      return;
    }

    if (formData.paymentMethod !== "cod" && !formData.trxId.trim()) {
      setError("অগ্রিম পেমেন্টের ক্ষেত্রে Transaction ID (TrxID) দিন");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerPhone: cleanPhone,
          address: formData.address.trim(),
          shippingCity: cityName,
          deliveryCharge,
          paymentMethod: formData.paymentMethod,
          transactionId: formData.trxId.trim() || null,
          website: honeypot,
          items: [
            {
              id: product.id,
              name: product.name,
              quantity: qty,
              price: product.price,
            },
          ],
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "অর্ডার সম্পন্ন হতে ব্যর্থ হয়েছে");
      }

      setSuccessData({
        orderId: data.orderId,
        invoice: data.invoice,
        total: grandTotal,
      });
    } catch (err: any) {
      setError(err.message || "কিছু একটা ভুল হয়েছে, দয়া করে পুনরায় চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-[#0f141c] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#141b26] to-[#1a2332] p-5 sm:p-6 border-b border-white/10 flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                দ্রুত অর্ডার / Express Checkout
              </h2>
              <p className="text-xs text-gray-400">সরাসরি ক্যাশ অন ডেলিভারি অথবা বিকাশে অর্ডার করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {successData ? (
            <div className="py-8 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">অর্ডার সফলভাবে সম্পন্ন হয়েছে!</h3>
              <p className="text-sm text-gray-300 max-w-md mb-6 leading-relaxed">
                ধন্যবাদ! আপনার ইনভয়েস নম্বর:{" "}
                <span className="font-mono font-bold text-cyan-400">{successData.invoice}</span>। আমাদের ডেলিভারি পার্টনার 
                <strong className="text-white"> Steadfast Courier</strong> এর মাধ্যমে আপনার পার্সেলটি দ্রুত পাঠানো হচ্ছে।
              </p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full max-w-md text-left mb-6 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>পণ্য:</span>
                  <span className="text-white font-medium">{product.name} (x{qty})</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>সর্বমোট প্রদেয়:</span>
                  <span className="text-cyan-400 font-bold font-mono">৳{successData.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>পেমেন্ট মোড:</span>
                  <span className="text-emerald-400 uppercase font-semibold">
                    {formData.paymentMethod === "cod" ? "Cash On Delivery" : formData.paymentMethod.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <a
                  href={`https://wa.me/8801755723451?text=${encodeURIComponent(`Hello Zia's Tech Shop! I just placed order ${successData.invoice} for ${product.name}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  হোয়াটসঅ্যাপে যোগাযোগ
                </a>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-colors"
                >
                  আরও কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Summary */}
              <div className="flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/10 pb-6 md:pb-0 md:pr-6">
                <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">অর্ডার সারসংক্ষেপ</h4>

                <div className="flex gap-3 bg-white/5 border border-white/5 p-3 rounded-xl items-center">
                  <div className="relative w-16 h-16 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain p-1"
                      />
                    ) : (
                      <Zap className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                    <p className="text-cyan-400 font-bold font-mono text-base mt-0.5">
                      ৳{product.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center justify-between bg-white/[0.03] border border-white/5 p-3 rounded-xl">
                  <span className="text-xs font-medium text-gray-300">পরিমাণ (Quantity)</span>
                  <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/40">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 font-bold transition-colors"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-sm font-mono font-bold text-white">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.min(product.stock || 50, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Delivery Zone Selection */}
                <div>
                  <label className="text-xs font-medium text-gray-300 block mb-2">
                    ডেলিভারি এলাকা নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(
                      [
                        { key: "dhaka", label: "ঢাকা সিটি", charge: 60 },
                        { key: "suburb", label: "ঢাকা সংলগ্ন", charge: 100 },
                        { key: "outside", label: "সারাদেশ", charge: 120 },
                      ] as const
                    ).map((z) => (
                      <button
                        key={z.key}
                        type="button"
                        onClick={() => setDeliveryZone(z.key)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                          deliveryZone === z.key
                            ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 font-bold shadow-lg shadow-cyan-500/10"
                            : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span>{z.label}</span>
                        <span className="text-[11px] font-mono font-normal">৳{z.charge}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white/[0.02] border border-white/5 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>পণ্যের মূল্য ({qty} টি)</span>
                    <span className="font-mono text-white">৳{productTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-mono text-white">৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-white/10 font-bold text-sm">
                    <span className="text-white">সর্বমোট মূল্য</span>
                    <span className="text-cyan-400 font-mono text-lg">৳{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>১০০% আসল ও টেস্টেড কম্পোনেন্ট, দ্রুততম ডেলিভারি</span>
                </div>
              </div>

              {/* Customer Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400">
                  গ্রাহকের ঠিকানা ও তথ্য
                </h4>

                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ সাকিব রহমান"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1">
                    সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/থানা) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="যেমন: বাসা ১২, রোড ৪, সেক্টর ৭, উত্তরা, ঢাকা"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-300 mb-1.5">
                    মূল্য পরিশোধের পদ্ধতি
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "cod" })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        formData.paymentMethod === "cod"
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold"
                          : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-sm">💵</div>
                      <div className="text-[11px] mt-0.5">ক্যাশ অন ডেলিভারি</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "bkash" })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        formData.paymentMethod === "bkash"
                          ? "bg-pink-500/10 border-pink-500/50 text-pink-400 font-bold"
                          : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-sm font-bold">bKash</div>
                      <div className="text-[11px] mt-0.5">বিকাশ সেন্ড মানি</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: "nagad" })}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        formData.paymentMethod === "nagad"
                          ? "bg-orange-500/10 border-orange-500/50 text-orange-400 font-bold"
                          : "bg-white/[0.03] border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-sm font-bold">Nagad</div>
                      <div className="text-[11px] mt-0.5">নগদ সেন্ড মানি</div>
                    </button>
                  </div>
                </div>

                {formData.paymentMethod !== "cod" && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2 animate-in fade-in">
                    <p className="text-xs text-amber-300 font-medium">
                      দয়া করে <strong>01755-723451</strong> (Personal) নম্বরে ৳{grandTotal.toLocaleString()} টাকা সেন্ড মানি করুন।
                    </p>
                    <input
                      type="text"
                      required
                      placeholder="Transaction ID (যেমন: 9K3A8B...)"
                      value={formData.trxId}
                      onChange={(e) => setFormData({ ...formData, trxId: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-white font-mono text-xs uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      অর্ডার প্রসেস হচ্ছে...
                    </>
                  ) : (
                    <>
                      <Truck className="w-4 h-4" />
                      অর্ডার নিশ্চিত করুন (৳{grandTotal.toLocaleString()})
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
