export default function Loading() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Skeleton */}
            <div className="relative min-h-[90vh] flex items-center justify-center">
                <div className="container px-4 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 order-2 md:order-1">
                        <div className="w-48 h-8 rounded-full bg-white/5 animate-pulse" />
                        <div className="w-full h-16 rounded-xl bg-white/5 animate-pulse" />
                        <div className="w-3/4 h-16 rounded-xl bg-white/5 animate-pulse" />
                        <div className="w-2/3 h-6 rounded-lg bg-white/5 animate-pulse" />
                        <div className="flex gap-4 pt-4">
                            <div className="w-40 h-12 rounded-full bg-white/5 animate-pulse" />
                            <div className="w-32 h-12 rounded-full bg-white/5 animate-pulse" />
                        </div>
                    </div>
                    <div className="w-full aspect-square rounded-3xl bg-white/[0.03] animate-pulse order-1 md:order-2" />
                </div>
            </div>

            {/* Categories Skeleton */}
            <div className="container px-4 mx-auto py-12">
                <div className="flex justify-between items-end mb-12">
                    <div className="space-y-3">
                        <div className="w-32 h-4 rounded bg-white/5 animate-pulse" />
                        <div className="w-56 h-10 rounded-xl bg-white/5 animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">
                    <div className="md:col-span-2 md:row-span-2 rounded-3xl bg-white/[0.03] animate-pulse" />
                    <div className="rounded-3xl bg-white/[0.03] animate-pulse" />
                    <div className="rounded-3xl bg-white/[0.03] animate-pulse" />
                    <div className="md:col-span-2 rounded-3xl bg-white/[0.03] animate-pulse" />
                </div>
            </div>

            {/* Products Skeleton */}
            <div className="container px-4 mx-auto py-12">
                <div className="flex justify-between items-end mb-10">
                    <div className="space-y-3">
                        <div className="w-24 h-4 rounded bg-white/5 animate-pulse" />
                        <div className="w-44 h-10 rounded-xl bg-white/5 animate-pulse" />
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl bg-white/[0.03] animate-pulse">
                            <div className="aspect-square rounded-t-2xl bg-white/[0.02]" />
                            <div className="p-4 space-y-3">
                                <div className="w-16 h-3 rounded bg-white/5" />
                                <div className="w-full h-5 rounded bg-white/5" />
                                <div className="w-24 h-6 rounded bg-white/5" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
