"use client";

import { Id } from "@convex/_generated/dataModel";
import { ReactionPill } from "./reaction-pill";

interface ReactionsProps {
    reactions: Array<{
        value: string; // emoji
        count: number;
        memberIds: Id<"members">[];
    }>;
    currentMemberId?: Id<"members">;
    onToggle: (emoji: string) => void;
    isPending?: boolean;
}

export const Reactions = ({
    reactions,
    currentMemberId,
    onToggle,
    isPending = false,
}: ReactionsProps) => {
    // Don't render anything if no reactions
    if (!reactions || reactions.length === 0) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
            {reactions.map((reaction) => {
                const isActive = currentMemberId
                    ? reaction.memberIds.includes(currentMemberId)
                    : false;

                return (
                    <ReactionPill
                        key={reaction.value}
                        emoji={reaction.value}
                        count={reaction.count}
                        isActive={isActive}
                        onClick={() => onToggle(reaction.value)}
                        isPending={isPending}
                    />
                );
            })}
        </div>
    );
};
