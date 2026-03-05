export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-bg-primary pt-24 pb-16">
            <div className="container mx-auto px-4">
                {/* Breadcrumb Skeleton */}
                <div className="w-48 h-4 bg-white/5 rounded mb-8 animate-pulse" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Image Skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-square rounded-2xl bg-white/5 animate-pulse border border-white/10" />
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square rounded-lg bg-white/5 animate-pulse border border-white/10" />
                            ))}
                        </div>
                    </div>

                    {/* Info Skeleton */}
                    <div className="space-y-6">
                        <div className="w-3/4 h-12 bg-white/5 rounded animate-pulse" />
                        <div className="w-1/2 h-6 bg-white/5 rounded animate-pulse" />
                        <div className="w-1/3 h-10 bg-white/5 rounded animate-pulse" />
                        <div className="w-full h-32 bg-white/5 rounded animate-pulse" />
                        <div className="flex gap-4">
                            <div className="flex-1 h-14 bg-white/5 rounded animate-pulse" />
                            <div className="w-14 h-14 bg-white/5 rounded animate-pulse" />
                            <div className="w-14 h-14 bg-white/5 rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Specs Skeleton */}
                <div className="w-full h-64 bg-white/5 rounded-2xl animate-pulse border border-white/10" />
            </div>
        </div>
    )
}
