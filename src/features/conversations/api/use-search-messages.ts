import { useQuery } from "convex/react";
import { useState, useEffect, useMemo } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { rankSearchResults, SearchResult } from "@/lib/search-utils";

interface UseSearchMessagesProps {
    workspaceId: Id<"workspaces">;
}

export const useSearchMessages = ({ workspaceId }: UseSearchMessagesProps) => {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce logic: 300ms delay
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // Fetch results from Convex
    const data = useQuery(
        api.dmSearch.searchDirectMessages,
        debouncedQuery.length >= 2 ? { workspaceId, query: debouncedQuery } : "skip"
    );

    // Combine, rank, and fuzzy match results
    const results = useMemo(() => {
        if (!data || debouncedQuery.length < 2) return [];

        return rankSearchResults(
            data.conversations || [],
            data.messages || [],
            debouncedQuery
        );
    }, [data, debouncedQuery]);

    const isLoading = data === undefined && debouncedQuery.length >= 2;

    return {
        query,
        setQuery,
        results,
        isLoading,
        isSearching: debouncedQuery.length >= 2,
    };
};
