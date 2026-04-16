"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Id } from "@convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetOtherMembers } from "@/features/members/api/use-get-other-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateOrGetConversation } from "@/features/conversations/api/use-create-or-get-conversation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewDirectMessageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const NewDirectMessageDialog = ({
    open,
    onOpenChange,
}: NewDirectMessageDialogProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const [searchQuery, setSearchQuery] = useState("");

    const { data: otherMembers, isLoading } = useGetOtherMembers({ workspaceId });
    const { mutate: createOrGetConversation, isPending } =
        useCreateOrGetConversation();

    const filteredMembers = otherMembers?.filter((member) =>
        member.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectMember = async (memberId: Id<"members">) => {
        createOrGetConversation(
            { workspaceId, memberId },
            {
                onSuccess: (conversationId) => {
                    router.push(`/workspace/${workspaceId}/member/${memberId}`);
                    onOpenChange(false);
                    setSearchQuery("");
                },
                onError: () => {
                    toast.error("Failed to start conversation");
                },
            }
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[520px] p-0 overflow-hidden">
                {/* Header Section with Premium Styling */}
                <div className="px-6 pt-6 pb-4 border-b border-border/50 bg-gradient-to-b from-background to-background/80">
                    <DialogHeader>
                        <DialogTitle className="text-left text-xl font-bold text-foreground">
                            Direct Messages
                        </DialogTitle>
                        <p className="text-sm text-muted-foreground text-left mt-1">
                            Start a conversation with your team members
                        </p>
                    </DialogHeader>
                </div>

                <div className="px-6 py-4 space-y-4">
                    {/* Premium Search Input */}
                    <div className="relative group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-secondary/40 border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:bg-background focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all outline-none placeholder:text-muted-foreground/50 text-foreground font-medium"
                        />
                    </div>

                    {/* Members List with Enhanced Styling */}
                    <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader className="size-6 animate-spin text-primary/60 mb-3" />
                                <p className="text-sm text-muted-foreground">Loading members...</p>
                            </div>
                        ) : filteredMembers && filteredMembers.length > 0 ? (
                            filteredMembers.map((member) => {
                                const avatarFallback =
                                    member.user?.name?.charAt(0).toUpperCase() || "M";

                                return (
                                    <Button
                                        key={member._id}
                                        variant="ghost"
                                        className="w-full justify-start h-auto py-3.5 px-3.5 hover:bg-secondary/60 active:bg-secondary/80 rounded-xl transition-all duration-200 group border border-transparent hover:border-border/30 hover:shadow-sm"
                                        onClick={() => handleSelectMember(member._id)}
                                        disabled={isPending}
                                    >
                                        <div className="flex items-center gap-3.5 w-full">
                                            {/* Enhanced Avatar */}
                                            <Avatar className="size-11 rounded-xl ring-2 ring-background shadow-sm group-hover:shadow-md transition-shadow">
                                                <AvatarImage src={member.user?.image} />
                                                <AvatarFallback className="bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 text-primary text-base font-bold rounded-xl">
                                                    {avatarFallback}
                                                </AvatarFallback>
                                            </Avatar>

                                            {/* User Info with Better Typography */}
                                            <div className="flex flex-col items-start flex-1 min-w-0 gap-0.5 text-left">
                                                <span className="font-bold text-[15px] truncate w-full text-foreground text-left group-hover:text-foreground transition-colors">
                                                    {member.user?.name || "Unknown"}
                                                </span>
                                                <span className="text-[13px] text-muted-foreground/80 truncate w-full font-medium text-left">
                                                    {member.user?.email}
                                                </span>
                                            </div>

                                            {/* Premium Active Badge */}
                                            {member.conversationId && (
                                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 shadow-sm">
                                                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50" />
                                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                                        Active
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </Button>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 px-4">
                                <div className="size-16 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                                    <Search className="size-7 text-muted-foreground/40" />
                                </div>
                                <p className="text-sm font-medium text-foreground/80 mb-1">
                                    {searchQuery ? "No members found" : "No members yet"}
                                </p>
                                <p className="text-xs text-muted-foreground text-center max-w-[280px]">
                                    {searchQuery
                                        ? "Try adjusting your search criteria"
                                        : "Invite team members to start collaborating"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
