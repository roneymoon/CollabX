import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HighlightedText } from "@/components/highlighted-text";
import { SearchResult } from "@/lib/search-utils";
import { formatDistanceToNow } from "date-fns";

interface MessageResultItemProps {
    result: SearchResult;
    query: string;
    onSelect: (messageId: string, targetMemberId: string) => void;
}

export const MessageResultItem = ({
    result,
    query,
    onSelect,
}: MessageResultItemProps) => {
    const avatarFallback = result.otherMember?.name?.charAt(0).toUpperCase() || "U";

    return (
        <button
            onClick={() => onSelect(result._id, result.targetMemberId || "")}
            className="w-full text-left flex items-start gap-4 px-3 py-3 hover:bg-neutral-100 dark:hover:bg-white/[0.03] transition-all group rounded-lg mx-1.5 active:scale-[0.995]"
        >
            <div className="shrink-0 pt-0.5">
                <Avatar className="size-9 rounded-full border border-black/5 dark:border-white/5 shadow-sm">
                    <AvatarImage src={result.otherMember?.image} />
                    <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold font-sans">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
            </div>

            <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[14px] font-semibold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                        {result.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground/40 font-medium whitespace-nowrap">
                        {formatDistanceToNow(result._creationTime, { addSuffix: true })}
                    </span>
                </div>
                <div className="text-[13px] text-muted-foreground/80 font-normal leading-relaxed line-clamp-2 bg-black/[0.02] dark:bg-white/[0.02] p-2 rounded-md border border-black/[0.03] dark:border-white/[0.03] group-hover:bg-white dark:group-hover:bg-zinc-900 transition-colors">
                    <HighlightedText text={result.highlightSnippet || result.subtitle || ""} query={query} />
                </div>
            </div>
        </button>
    );
};
