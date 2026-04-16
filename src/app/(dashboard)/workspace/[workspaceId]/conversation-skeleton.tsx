import { Skeleton } from "@/components/ui/skeleton";

export const ConversationSkeleton = () => {
    return (
        <div className="flex items-center gap-2.5 px-3 py-2 my-0.5">
            {/* Avatar skeleton */}
            <Skeleton className="size-6 rounded-lg shrink-0" />

            {/* Name skeleton */}
            <Skeleton className="h-4 flex-1" />

            {/* Optional badge skeleton */}
            <Skeleton className="size-4 rounded-full" />
        </div>
    );
};

export const ConversationListSkeleton = () => {
    return (
        <div className="space-y-1">
            <ConversationSkeleton />
            <ConversationSkeleton />
            <ConversationSkeleton />
        </div>
    );
};
