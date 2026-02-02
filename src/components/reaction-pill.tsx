"use client";

import { cn } from "@/lib/utils";

interface ReactionPillProps {
    emoji: string;
    count: number;
    isActive: boolean;
    onClick: () => void;
    isPending?: boolean;
}

export const ReactionPill = ({
    emoji,
    count,
    isActive,
    onClick,
    isPending = false,
}: ReactionPillProps) => {
    return (
        <button
            onClick={onClick}
            disabled={isPending}
            className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm transition-all duration-200 reaction-add active:scale-95",
                "border",
                isPending && "opacity-50 cursor-not-allowed",
                !isPending && "cursor-pointer",
                // Inactive state
                !isActive &&
                "bg-slate-100/50 dark:bg-zinc-800/50 text-slate-700 dark:text-zinc-300 border-transparent hover:bg-slate-200/70 dark:hover:bg-zinc-700/70 hover:border-slate-300 dark:hover:border-zinc-600",
                // Active state (user reacted)
                isActive &&
                "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 font-semibold"
            )}
        >
            <span className="text-base leading-none">{emoji}</span>
            <span className="text-xs font-medium">{count}</span>
        </button>
    );
};
