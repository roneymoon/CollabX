import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HighlightedText } from "@/components/highlighted-text";
import { SearchResult } from "@/lib/search-utils";
import { ChevronRight } from "lucide-react";

interface ConversationResultItemProps {
    result: SearchResult;
    query: string;
    onSelect: (targetMemberId: string) => void;
}

export const ConversationResultItem = ({
    result,
    query,
    onSelect,
}: ConversationResultItemProps) => {
    const avatarFallback = result.title?.charAt(0).toUpperCase() || "C";

    return (
        <button
            onClick={() => onSelect(result.targetMemberId || "")}
            className="w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-all group rounded-lg mx-1.5 active:scale-[0.995]"
        >
            <div className="shrink-0 relative">
                <Avatar className="size-9 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                    <AvatarImage src={result.otherMember?.image} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold font-sans">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 size-3 bg-emerald-500 border-2 border-white dark:border-zinc-950 rounded-full" />
            </div>

            <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="text-[14px] font-semibold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                        <HighlightedText text={result.title || ""} query={query} />
                    </span>
                    <ChevronRight className="size-3.5 text-muted-foreground/30 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </div>
                {result.subtitle && (
                    <p className="text-[12px] text-muted-foreground/70 font-medium truncate leading-none">
                        {result.subtitle}
                    </p>
                )}
            </div>
        </button>
    );
};
