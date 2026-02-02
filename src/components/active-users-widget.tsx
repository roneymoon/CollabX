"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const activeUsers = [
    { initials: "AR", color: "bg-primary/10 text-primary" },
    { initials: "SC", color: "bg-emerald-500/10 text-emerald-600" },
    { initials: "JW", color: "bg-amber-500/10 text-amber-600" },
    { initials: "RM", color: "bg-blue-500/10 text-blue-600" },
];

export const ActiveUsersWidget = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/60 uppercase">
                    Active Now
                </span>
                <div className="flex items-center gap-1.5">
                    <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-semibold tracking-[0.1em] text-emerald-600 dark:text-emerald-400 uppercase">
                        {activeUsers.length} Active
                    </span>
                </div>
            </div>

            {/* Avatar Stack */}
            <div className="flex items-center -space-x-2">
                {activeUsers.map((user, index) => (
                    <Avatar
                        key={index}
                        className="size-9 rounded-full border-2 border-white dark:border-zinc-900 ring-1 ring-black/5"
                    >
                        <AvatarFallback className={`${user.color} text-xs font-semibold`}>
                            {user.initials}
                        </AvatarFallback>
                    </Avatar>
                ))}
            </div>
        </div>
    );
};
