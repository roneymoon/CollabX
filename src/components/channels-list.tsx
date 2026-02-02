"use client";

import { Hash } from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface Channel {
    id: string;
    name: string;
    unreadCount?: number;
}

const channels: Channel[] = [
    { id: "1", name: "budget-scheme", unreadCount: 3 },
    { id: "2", name: "general-server" },
    { id: "3", name: "marketing" },
];

export const ChannelsList = () => {
    const workspaceId = useWorkspaceId();

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5">
            {/* Header */}
            <h3 className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/60 uppercase mb-4">
                Channels
            </h3>

            {/* Channel List */}
            <div className="space-y-1">
                {channels.map((channel) => (
                    <Link
                        key={channel.id}
                        href={`/workspace/${workspaceId}/channel/${channel.id}`}
                        className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        <div className="flex items-center gap-2">
                            <Hash
                                className="size-4 text-muted-foreground/50 group-hover:text-muted-foreground/70"
                                strokeWidth={2}
                            />
                            <span className="text-[14px] text-foreground/80 group-hover:text-foreground">
                                {channel.name}
                            </span>
                        </div>
                        {channel.unreadCount && (
                            <div className="size-5 flex items-center justify-center bg-primary rounded-full">
                                <span className="text-[11px] font-semibold text-white">
                                    {channel.unreadCount}
                                </span>
                            </div>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    );
};
