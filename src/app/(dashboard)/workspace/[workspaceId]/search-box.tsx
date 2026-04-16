"use client";

import { useRef, useState } from "react";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useSearchMessages } from "@/features/conversations/api/use-search-messages";
import { SearchResults } from "./search-results";
import { useClickAway } from "react-use";
import { useNavigateToMessage } from "@/hooks/use-navigate-to-message";

export const SearchBox = () => {
    const workspaceId = useWorkspaceId();
    const navigateToMessage = useNavigateToMessage();
    const [showDropdown, setShowDropdown] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const { query, setQuery, results, isLoading, isSearching } = useSearchMessages({
        workspaceId,
    });

    useClickAway(containerRef, () => {
        setShowDropdown(false);
    });

    const handleSelect = (targetMemberId: string) => {
        navigateToMessage("" as any, targetMemberId as any);
        setShowDropdown(false);
        setQuery("");
    };

    const handleMessageSelect = (messageId: string, targetMemberId: string) => {
        navigateToMessage(messageId as any, targetMemberId as any);
        setShowDropdown(false);
        setQuery("");
    };

    return (
        <div ref={containerRef} className="relative w-full px-6 mb-6">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Jump to a conversation..."
                    className="w-full bg-white/60 dark:bg-zinc-900/60 border border-black/5 dark:border-white/5 rounded-[24px] py-3 px-5 text-[13px] focus:bg-white dark:focus:bg-zinc-900 transition-all outline-none ring-0 focus:ring-1 focus:ring-primary/20 placeholder:text-muted-foreground/40 text-foreground"
                />

                {showDropdown && isSearching && (
                    <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[100] bg-white dark:bg-[#09090b] border border-black/10 dark:border-white/10 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] overflow-hidden animate-in fade-in slide-in-from-top-3 duration-300 ease-out backdrop-blur-xl">
                        <div className="absolute inset-0 bg-primary/[0.02] pointer-events-none" />
                        <div className="relative">
                            <SearchResults
                                results={results}
                                isLoading={isLoading}
                                query={query}
                                onSelect={handleSelect}
                                onMessageSelect={handleMessageSelect}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
