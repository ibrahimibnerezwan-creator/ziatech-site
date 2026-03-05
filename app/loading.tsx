export default function Loading() {
    return (
        <div className="flex flex-col gap-10 min-h-screen pt-24">
            {/* Hero Skeleton */}
            <div className="container px-4 mx-auto">
                <div className="w-full h-[500px] rounded-3xl bg-white/5 animate-pulse border border-white/10" />
            </div>

            {/* Category Grid Skeleton */}
            <div className="container px-4 mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                    ))}
                </div>
            </div>

            {/* Product List Skeleton */}
            <div className="container px-4 mx-auto py-12">
                <div className="flex justify-between items-center mb-8">
                    <div className="w-48 h-10 bg-white/5 rounded-lg animate-pulse" />
                    <div className="w-32 h-10 bg-white/5 rounded-lg animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                    ))}
                </div>
            </div>
        </div>
    )
}
