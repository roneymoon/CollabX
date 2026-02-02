import { Loader, Plus, ChevronDown } from "lucide-react";

import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const WorkspaceSwitcher = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [_open, setOpen] = useCreateWorkspaceModal();

  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();

  const filteredWorkspaces = workspaces?.filter(
    (workspace) => workspace?._id !== workspaceId,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-11 group relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-black/5 dark:border-white/5 shadow-sm rounded-2xl transition-all duration-300 active:scale-95">
          {workspaceLoading ? (
            <Loader className="size-5 animate-spin text-muted-foreground/50 shrink-0" />
          ) : (
            <div className="flex items-center justify-center relative z-10">
              <span className="text-primary font-bold text-xl tracking-tighter drop-shadow-sm">
                {workspace?.name?.charAt(0).toUpperCase()}
              </span>
              <div className="absolute -bottom-1 -right-1 size-2 bg-emerald-500 rounded-full border-2 border-zinc-100 dark:border-zinc-900 group-hover:scale-125 transition-transform" />
            </div>
          )}

          {/* Subtle Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="right" align="start" className="w-72 p-2 bg-white dark:bg-[#09090b] border-black/10 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 duration-300">
        <DropdownMenuItem
          onClick={() => router.push(`/workspace/${workspaceId}`)}
          className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-primary/[0.03] dark:hover:bg-white/[0.03] transition-all group"
        >
          <div className="size-10 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg shadow-inner">
            {workspace?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-[14px] text-foreground tracking-tight group-hover:text-primary transition-colors">
              {workspace?.name}
            </span>
            <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
              Active workspace
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-black/[0.05] dark:bg-white/[0.05]" />

        <div className="px-1 py-2 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.05em] px-3">
          Other Workspaces
        </div>

        {filteredWorkspaces?.map((workspace) => (
          <DropdownMenuItem
            key={workspace._id}
            className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-all group"
            onClick={() => router.push(`/workspace/${workspace._id}`)}
          >
            <div className="size-10 shrink-0 border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-zinc-800 text-foreground text-lg rounded-lg flex items-center justify-center font-bold shadow-sm group-hover:bg-white dark:group-hover:bg-zinc-700 transition-colors">
              {workspace.name.charAt(0).toUpperCase()}
            </div>
            <p className="truncate font-semibold text-[14px]">{workspace.name}</p>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator className="my-2 bg-black/[0.05] dark:bg-white/[0.05]" />

        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-emerald-600 transition-all group"
          onClick={() => setOpen(true)}
        >
          <div className="size-10 shrink-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 font-semibold rounded-lg flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Plus className="size-5" />
          </div>
          <span className="font-semibold text-[14px]">Create a new workspace</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
