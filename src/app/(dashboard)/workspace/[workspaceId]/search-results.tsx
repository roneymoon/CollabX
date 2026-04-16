import { SearchResult } from "@/lib/search-utils";
import { SearchSkeleton } from "./search-skeleton";
import { ConversationResultItem } from "./conversation-result-item";
import { MessageResultItem } from "./message-result-item";
import { Search, Users, MessageSquare } from "lucide-react";

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    query: string;
    onSelect: (targetMemberId: string) => void;
    onMessageSelect: (messageId: string, targetMemberId: string) => void;
}

export const SearchResults = ({
    results,
    isLoading,
    query,
    onSelect,
    onMessageSelect,
}: SearchResultsProps) => {
    if (isLoading) return <SearchSkeleton />;

    if (results.length === 0) {
        return (
            <div className="py-12 flex flex-col items-center justify-center gap-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="size-12 bg-neutral-100 dark:bg-white/5 rounded-2xl flex items-center justify-center">
                    <Search className="size-6 text-muted-foreground/40" />
                </div>
                <p className="text-[13px] text-muted-foreground/60 font-medium">
                    No conversations or messages found
                </p>
            </div>
        );
    }

    const conversations = results.filter((r) => r.type === "conversation");
    const messages = results.filter((r) => r.type === "message");

    return (
        <div className="h-full max-h-[480px] overflow-y-auto scrollbar-hide focus:outline-none py-2">
            <div className="flex flex-col">
                {conversations.length > 0 && (
                    <div className="mb-4">
                        <div className="px-5 py-2 mb-1 flex items-center gap-2">
                            <Users className="size-3.5 text-primary/60" />
                            <h3 className="text-[11px] font-bold text-muted-foreground/40 tracking-[0.05em] uppercase">
                                People
                            </h3>
                        </div>
                        <div className="space-y-0.5">
                            {conversations.map((result) => (
                                <ConversationResultItem
                                    key={result._id}
                                    result={result}
                                    query={query}
                                    onSelect={onSelect}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {conversations.length > 0 && messages.length > 0 && (
                    <div className="mx-5 my-2 border-t border-black/[0.04] dark:border-white/[0.04]" />
                )}

                {messages.length > 0 && (
                    <div className="mb-2">
                        <div className="px-5 py-2 mb-1 flex items-center gap-2">
                            <MessageSquare className="size-3.5 text-primary/60" />
                            <h3 className="text-[11px] font-bold text-muted-foreground/40 tracking-[0.05em] uppercase">
                                Messages
                            </h3>
                        </div>
                        <div className="space-y-0.5">
                            {messages.map((result) => (
                                <MessageResultItem
                                    key={result._id}
                                    result={result}
                                    query={query}
                                    onSelect={onMessageSelect}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
