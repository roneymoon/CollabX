"use client";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export const TeamStatusCard = () => {
  const workspaceId = useWorkspaceId();
  const { data: members, isLoading } = useGetMembers({ workspaceId });

  if (isLoading || !members) return null;

  const displayMembers = members.slice(0, 3);
  const remainingCount = members.length - displayMembers.length;

  return (
    <div className="mt-auto mb-1 flex justify-center w-full px-2">
      <div className="glass-card rounded-full pl-4 pr-2 py-1.5 flex items-center gap-x-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] border-white/40 bg-white/60 dark:bg-black/40 backdrop-blur-md w-fit max-w-full">
        <p className="text-[13px] text-foreground/90 tracking-tight font-serif whitespace-nowrap">
          Team Active
        </p>

        <div className="flex items-center -space-x-2">
          {displayMembers.map((member) => (
            <Avatar
              key={member._id}
              className="size-7 border-2 border-white dark:border-black shrink-0 transition-all duration-300 hover:scale-110 hover:z-10 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              <AvatarImage
                src={member.user.image}
                className="grayscale hover:grayscale-0 transition-all"
              />
              <AvatarFallback className="text-[9px] bg-[#f8fafc] dark:bg-zinc-900 text-muted-foreground/50 font-serif">
                {member.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          {remainingCount > 0 && (
            <div className="size-7 rounded-full border-2 border-white dark:border-black bg-[#f8fafc] dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-muted-foreground/40 shrink-0 shadow-sm">
              +{remainingCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
