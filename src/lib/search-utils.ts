/**
 * Simple fuzzy matching using Levenshtein distance
 * Returns true if the distance is within tolerance (1 char diff per 4 chars)
 */
export function fuzzyMatch(query: string, target: string): boolean {
    const q = query.toLowerCase().trim();
    const t = target.toLowerCase().trim();

    if (t.includes(q)) return true;

    const distance = levenshteinDistance(q, t);
    const tolerance = Math.max(1, Math.floor(t.length / 4));

    return distance <= tolerance;
}

/**
 * Standard Levenshtein distance algorithm
 */
function levenshteinDistance(s1: string, s2: string): number {
    const len1 = s1.length;
    const len2 = s2.length;
    const matrix = Array.from({ length: len1 + 1 }, () => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return matrix[len1][len2];
}

export interface SearchResult {
    _id: string;
    type: "conversation" | "message";
    title?: string; // name for conversation, body for message
    subtitle?: string; // last message for conversation, snippet for message
    otherMember?: {
        name?: string;
        image?: string;
    };
    score: number;
    highlightSnippet?: string;
    conversationId?: string;
    targetMemberId?: string;
    _creationTime: number;
}

/**
 * Simple HTML stripper
 */
export function stripHtml(html: string): string {
    if (!html) return "";
    // Basic regex to strip HTML tags
    return html.replace(/<[^>]*>?/gm, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .trim();
}

interface SearchConversation {
    _id: string;
    _creationTime?: number;
    otherMember: {
        name?: string;
        image?: string;
    };
    lastMessage?: {
        body: string;
    } | null;
    targetMemberId: string;
}

interface SearchMessage {
    _id: string;
    _creationTime?: number;
    body: string;
    sender: {
        name?: string;
        image?: string;
    } | null;
    conversationId: string;
    targetMemberId: string;
}

/**
 * Rank results based on relevance
 */
export function rankSearchResults(
    conversations: SearchConversation[],
    messages: SearchMessage[],
    query: string
): SearchResult[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const results: SearchResult[] = [];

    // Process Conversations
    conversations.forEach(conv => {
        let score = 0;
        const name = (conv.otherMember.name || "Conversation").toLowerCase();

        if (name === q) score += 100;
        else if (name.startsWith(q)) score += 80;
        else if (name.includes(q)) score += 60;
        else if (fuzzyMatch(q, name)) score += 40;

        if (score > 0) {
            const cleanPreview = stripHtml(conv.lastMessage?.body || "");
            results.push({
                _id: conv._id,
                type: "conversation",
                title: conv.otherMember.name,
                subtitle: cleanPreview,
                otherMember: conv.otherMember,
                targetMemberId: conv.targetMemberId,
                score,
                _creationTime: conv._creationTime || 0,
            });
        }
    });

    // Process Messages
    messages.forEach(msg => {
        let score = 0;
        const cleanBody = stripHtml(msg.body);
        const bodyLower = cleanBody.toLowerCase();

        if (bodyLower.includes(q)) score += 50;
        else if (fuzzyMatch(q, bodyLower)) score += 30;

        if (score > 0) {
            results.push({
                _id: msg._id,
                type: "message",
                title: msg.sender?.name || "Message",
                subtitle: cleanBody,
                otherMember: msg.sender || undefined,
                score,
                highlightSnippet: generateHighlight(cleanBody, q),
                conversationId: msg.conversationId,
                targetMemberId: msg.targetMemberId,
                _creationTime: msg._creationTime || 0,
            });
        }
    });

    return results.sort((a, b) => b.score - a.score || b._creationTime - a._creationTime);
}

/**
 * Generate a snippet of text around the match with highlights
 */
export function generateHighlight(text: string, query: string): string {
    const cleanText = stripHtml(text);
    const normalizedText = cleanText.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    const matchIndex = normalizedText.indexOf(normalizedQuery);

    if (matchIndex === -1) return cleanText.slice(0, 100);

    const start = Math.max(0, matchIndex - 40);
    const end = Math.min(cleanText.length, matchIndex + query.length + 40);

    let snippet = cleanText.slice(start, end);
    if (start > 0) snippet = "..." + snippet;
    if (end < cleanText.length) snippet = snippet + "...";

    return snippet;
}
