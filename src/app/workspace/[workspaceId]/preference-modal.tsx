"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { TrashIcon, Settings2, Edit3, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PreferencesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialValue: string;
}

export const PreferenceModal = ({
  open,
  setOpen,
  initialValue,
}: PreferencesModalProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete workspace?",
    "This will permanently delete the workspace and all its data. This action is irreversible.",
  );

  const [value, setValue] = useState(initialValue);
  const [editOpen, setEditOpen] = useState(false);

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
    useUpdateWorkspace();

  const { mutate: removeWorkspace, isPending: isRemovingWorkspace } =
    useRemoveWorkspace();

  const handleRemove = async () => {
    const ok = await confirm();
    if (!ok) return;

    removeWorkspace(
      { id: workspaceId },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          router.replace("/");
        },
        onError: () => {
          toast.error("Failed to delete workspace");
        },
      },
    );
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateWorkspace(
      { id: workspaceId, name: value },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("Workspace updated");
        },
        onError: () => {
          toast.error("Failed to update workspace");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0 border-0 shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden bg-white dark:bg-zinc-900 max-w-[480px] backdrop-blur-2xl">
          <DialogHeader className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-zinc-50/80 to-white dark:from-zinc-900/80 dark:to-zinc-800/80 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                <div className="relative size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <Settings2 className="size-6 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">
                  Workspace Settings
                </DialogTitle>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Manage your workspace identity and privacy
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 bg-white dark:bg-zinc-800/50 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-3.5 text-blue-500" />
                        <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.1em]">
                          Display Name
                        </p>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2">
                        Edit
                        <Edit3 className="size-3" />
                      </span>
                    </div>
                    <p className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                      {initialValue}
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[440px] rounded-[24px] border-0 shadow-3xl p-0 overflow-hidden bg-white dark:bg-zinc-900">
                <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
                  <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                    Rename workspace
                  </DialogTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    This is how your team will identify your workplace
                  </p>
                </DialogHeader>
                <form className="p-6 space-y-6" onSubmit={handleEdit}>
                  <div className="space-y-4">
                    <Input
                      value={value}
                      disabled={isUpdatingWorkspace}
                      onChange={(e) => setValue(e.target.value)}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="e.g. Acme Corp"
                      className="h-12 px-4 rounded-xl border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <DialogFooter className="gap-2">
                    <DialogClose asChild>
                      <Button
                        variant="ghost"
                        className="rounded-xl h-11 px-6 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        disabled={isUpdatingWorkspace}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button
                      disabled={isUpdatingWorkspace}
                      className="rounded-xl h-11 px-8 font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 transition-all"
                    >
                      {isUpdatingWorkspace ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-2 rounded-full bg-red-400" />
                <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.1em]">
                  Danger Zone
                </p>
              </div>

              <button
                disabled={isRemovingWorkspace}
                onClick={handleRemove}
                className="w-full group relative overflow-hidden rounded-2xl border border-red-200/60 dark:border-red-900/30 bg-white dark:bg-zinc-900 transition-all duration-300 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50/30 dark:hover:bg-red-950/10 hover:shadow-lg hover:shadow-red-500/10 disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-rose-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                <div className="relative flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                      <TrashIcon className="size-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[15px] font-bold text-red-600 dark:text-red-400">
                        Delete Workspace
                      </p>
                      <p className="text-xs text-red-600/70 dark:text-red-400/60 font-medium">
                        Permanently remove this environment
                      </p>
                    </div>
                  </div>
                  <Edit3 className="size-4 text-red-400 dark:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2" />
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
