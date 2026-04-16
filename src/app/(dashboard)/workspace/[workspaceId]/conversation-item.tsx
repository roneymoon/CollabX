"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { Id } from "@convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemberId } from "@/hooks/use-member-id";

const conversationItemVariants = cva(
    "flex items-center gap-2 justify-start font-medium h-9 px-3 text-sm overflow-hidden sidebar-item-transition rounded-xl my-0.5 relative",
    {
        variants: {
            variant: {
                default:
                    "text-muted-foreground hover:bg-secondary hover:text-foreground",
                active: "text-primary bg-primary/5 hover:bg-primary/10",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

interface ConversationItemProps {
    id: Id<"members">;
    label?: string;
    image?: string;
    variant?: VariantProps<typeof conversationItemVariants>["variant"];
    unreadCount?: number;
    isOnline?: boolean;
}

export const ConversationItem = ({
    id,
    label = "Member",
    image,
    variant,
    unreadCount = 0,
    isOnline = false,
}: ConversationItemProps) => {
    const workspaceId = useWorkspaceId();
    const memberId = useMemberId();
    const avatarFallback = label.charAt(0).toUpperCase();

    const isActive = memberId === id;

    return (
        <Button
            variant="transparent"
            className={cn(conversationItemVariants({ variant: isActive ? "active" : variant }))}
            size="sm"
            asChild
        >
            <Link
                href={`/workspace/${workspaceId}/member/${id}`}
                className="flex items-center gap-2.5 w-full"
            >
                <div className="relative">
                    <Avatar className="size-6 rounded-lg border-white/50 shadow-none shrink-0">
                        <AvatarImage src={image} />
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                            {avatarFallback}
                        </AvatarFallback>
                    </Avatar>
                    {/* Online status indicator */}
                    {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-[1.5px] border-white dark:border-black" />
                    )}
                </div>

                <span className="text-sm truncate opacity-90 flex-1">{label}</span>

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <div className="ml-auto flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-destructive text-white text-[10px] font-bold px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </div>
                )}

                {/* Active indicator */}
                {isActive && unreadCount === 0 && (
                    <div className="ml-auto size-1 rounded-full bg-primary" />
                )}
            </Link>
        </Button>
    );
};
