"use client";

import { format } from "date-fns";
import {
    X,
    Calendar,
    Clock,
    Users,
    BellOff,
    Star,
    Pin,
    LogOut,
    ChevronRight,
    Info
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/hints";
import { cn } from "@/lib/utils";
import { useConfirm } from "@/hooks/use-confirm";

interface ChannelInfoPanelProps {
    channelId: Id<"channels">;
    workspaceId: Id<"workspaces">;
    title: string;
    creationTime: number;
    members: any[];
    onClose: () => void;
    isAdmin: boolean;
    onLeave: () => void;
}

export const ChannelInfoPanel = ({
    channelId,
    workspaceId,
    title,
    creationTime,
    members,
    onClose,
    isAdmin,
    onLeave,
}: ChannelInfoPanelProps) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isStarred, setIsStarred] = useState(false);
    const [isPinned, setIsPinned] = useState(false);

    const [ConfirmLeaveDialog, confirmLeave] = useConfirm(
        "Leave channel?",
        "Are you sure you want to leave this channel? You will need an invite to join back."
    );

    const handleLeave = async () => {
        const ok = await confirmLeave();
        if (ok) {
            onLeave();
        }
    };

    return (
        <div className="h-full flex flex-col bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-right duration-300">
            <ConfirmLeaveDialog />

            {/* Header */}
            <div className="h-[72px] flex items-center justify-between px-6 border-b border-zinc-200/50 dark:border-zinc-800/50 flex-shrink-0 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 shadow-sm">
                        <Info className="size-4 text-zinc-500" />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-none">
                            Channel Details
                        </h2>
                        <p className="text-[11px] text-zinc-500 font-medium mt-1">
                            #{title}
                        </p>
                    </div>
                </div>
                <Button
                    onClick={onClose}
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 transition-all hover:rotate-90 duration-300"
                >
                    <X className="size-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
                {/* At a Glance Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-blue-500" />
                        <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            At a Glance
                        </h3>
                    </div>

                    <div className="grid gap-3">
                        <div className="group flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md hover:shadow-black/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105">
                                <Calendar className="size-5 text-zinc-500" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[11px] text-zinc-400 font-medium">Created</p>
                                <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-200">
                                    {format(creationTime, "MMM d, yyyy")}
                                </p>
                            </div>
                        </div>

                        <div className="group flex items-center gap-4 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 transition-all hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md hover:shadow-black/5">
                            <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shadow-sm transition-transform group-hover:scale-105">
                                <Clock className="size-5 text-zinc-500" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-[11px] text-zinc-400 font-medium">Last Activity</p>
                                <p className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-200">
                                    Just now
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* People Section */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                            <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                People
                            </h3>
                        </div>
                        <Button variant="link" size="sm" className="h-auto p-0 text-[11px] font-bold text-blue-500 hover:text-blue-600 tracking-tight">
                            See all
                        </Button>
                    </div>

                    <div className="flex items-center space-x-[-12px] px-2 py-1">
                        {members.slice(0, 5).map((member, i) => (
                            <Hint key={member._id} label={member.user.name || "Member"}>
                                <Avatar
                                    className={cn(
                                        "size-10 border-2 border-white dark:border-zinc-950 shadow-md transition-transform hover:scale-110 cursor-pointer relative",
                                        i === 0 ? "z-[5]" : i === 1 ? "z-[4]" : i === 2 ? "z-[3]" : i === 3 ? "z-[2]" : "z-[1]"
                                    )}
                                >
                                    <AvatarImage src={member.user.image} />
                                    <AvatarFallback className="bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold">
                                        {member.user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Hint>
                        ))}
                        {members.length > 5 && (
                            <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-900 border-2 border-white dark:border-zinc-950 flex items-center justify-center text-[11px] font-bold text-zinc-500 shadow-sm z-0">
                                +{members.length - 5}
                            </div>
                        )}
                    </div>
                </section>

                {/* Preferences Section */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-amber-500" />
                        <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                            Preferences
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden divide-y divide-zinc-200/60 dark:divide-zinc-800/60 shadow-sm">
                        <div className="flex items-center justify-between p-4 bg-zinc-50/30 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <BellOff className="size-4 text-zinc-400" />
                                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Mute notifications</span>
                            </div>
                            <Switch checked={isMuted} onCheckedChange={setIsMuted} className="data-[state=checked]:bg-blue-500 scale-90" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50/30 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <Star className={cn("size-4", isStarred ? "text-amber-500 fill-amber-500" : "text-zinc-400")} />
                                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Starred channel</span>
                            </div>
                            <Switch checked={isStarred} onCheckedChange={setIsStarred} className="data-[state=checked]:bg-amber-500 scale-90" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-zinc-50/30 dark:bg-zinc-900/10 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <Pin className={cn("size-4", isPinned ? "text-blue-500 fill-blue-500" : "text-zinc-400")} />
                                <span className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">Pin to sidebar</span>
                            </div>
                            <Switch checked={isPinned} onCheckedChange={setIsPinned} className="data-[state=checked]:bg-blue-500 scale-90" />
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="pt-4">
                    <Button
                        onClick={handleLeave}
                        variant="ghost"
                        className="w-full group h-auto p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-200 dark:hover:border-rose-900/50 transition-all duration-300"
                    >
                        <div className="flex items-center gap-4 w-full">
                            <LogOut className="size-4 text-zinc-400 group-hover:text-rose-500 transition-colors" />
                            <div className="flex flex-col items-start gap-0.5">
                                <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                    Leave Channel
                                </span>
                                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium group-hover:text-rose-400 dark:group-hover:text-rose-500/70 transition-colors">
                                    You will exit this channel
                                </span>
                            </div>
                        </div>
                    </Button>
                </section>
            </div>

            <div className="p-6 bg-zinc-50/50 dark:bg-zinc-900/20 border-t border-zinc-200/50 dark:border-zinc-800/50 flex flex-col items-center gap-1.5">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-center">
                    Channel ID: {channelId.slice(0, 8)}...
                </p>
                <p className="text-[10px] text-zinc-400/60 font-medium flex items-center gap-1">
                    <span className="size-1 rounded-full bg-zinc-300" />
                    Private to {workspaceId.slice(0, 8)} Workspace
                </p>
            </div>
        </div>
    );
};
