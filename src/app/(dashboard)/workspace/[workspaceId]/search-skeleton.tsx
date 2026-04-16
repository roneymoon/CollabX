import { Skeleton } from "@/components/ui/skeleton";

export const SearchSkeleton = () => {
    return (
        <div className="p-2 space-y-2">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="size-10 rounded-full shrink-0" />
                    <div className="space-y-2 flex-1 min-w-0">
                        <Skeleton className="h-4 w-[40%]" />
                        <Skeleton className="h-3 w-[80%]" />
                    </div>
                </div>
            ))}
        </div>
    );
};
