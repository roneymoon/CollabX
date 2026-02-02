"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { UserButton } from "@/features/auth/components/user-button";
import { WorkspaceSwitcher } from "./workspace-switcher";

import { SidebarButton } from "./sidebar-button";
import { Bell, MessagesSquare, MoreHorizontal, LayoutGrid, Settings, Compass } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";

export const Sidebar = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const { data: members } = useGetMembers({ workspaceId });

  const firstMemberId = members?.[0]?._id;

  return (
    <aside className="w-[84px] h-full bg-[#fcfcfc] dark:bg-[#0a0a0a] flex flex-col items-center pt-8 pb-4 border-r border-black/[0.04] dark:border-white/[0.04] shadow-sm relative z-40">

      {/* Workspace Logo Section */}
      <div className="mb-8">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation Buttons Area */}
      <div className="flex flex-col gap-y-4 w-full items-center">
        {firstMemberId ? (
          <Link href={`/workspace/${workspaceId}/member/${firstMemberId}`} className="w-full">
            <SidebarButton
              icon={MessagesSquare}
              label="Direct Messages"
              isActive={pathname.includes("/member/")}
            />
          </Link>
        ) : (
          <SidebarButton
            icon={MessagesSquare}
            label="Direct Messages"
            isActive={pathname.includes("/member/")}
          />
        )}

        <Link href={`/workspace/${workspaceId}/activity`} className="w-full">
          <SidebarButton
            icon={Bell}
            label="Activity Tracking"
            isActive={pathname.includes("/activity")}
          />
        </Link>

        <SidebarButton icon={Compass} label="Browse Channels" />
        <SidebarButton icon={MoreHorizontal} label="More Actions" />
      </div>

      {/* Footer Section - Utils */}
      <div className="mt-auto flex flex-col items-center gap-y-5 px-4 w-full">
        <ModeToggle />

        <div className="h-px w-full bg-black/[0.05] dark:bg-white/[0.05]" />

        <div className="relative group p-1">
          <div className="absolute inset-0 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <UserButton />
        </div>
      </div>
    </aside>
  );
};
