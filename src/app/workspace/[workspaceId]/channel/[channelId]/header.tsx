import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Hint } from "@/components/hints";

interface HeaderProps {
  title: string;
}

export const Header = ({ title }: HeaderProps) => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState(title);

  const { data: member } = useCurrentMember({ workspaceId });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });

  const [ConfirmDialog, confirm] = useConfirm(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible.",
  );

  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel();

  const { mutate: removeChannel, isPending: removingChannel } =
    useRemoveChannel();

  const isAdmin = member?.role === "admin";

  useEffect(() => {
    setName(title);
  }, [title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
    setName(value);
  };

  const handleEditOpen = (open: boolean) => {
    if (!isAdmin) return;
    setEditOpen(open);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!channelId) return;

    updateChannel(
      { id: channelId, name },
      {
        onSuccess: () => {
          toast.success("Channel updated");
          setEditOpen(false);
        },
        onError: () => {
          toast.error("Failed to update channel");
        },
      },
    );
  };

  const handleRemove = async () => {
    if (!channelId || !workspaceId || !isAdmin) return;

    const ok = await confirm();
    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error("Failed to delete channel");
        },
      },
    );
  };

  return (
    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl h-[72px] flex items-center justify-between px-8 sticky top-0 z-10 border-b border-border/5">
      <ConfirmDialog />

      <div className="flex items-center gap-4 h-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="transparent"
              size="sm"
              className="flex items-center gap-2 px-0 hover:bg-transparent group h-auto"
            >
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground/30 font-serif text-3xl -translate-y-[2px]">
                  #
                </span>
                <span className="text-[22px] font-serif text-[#111827] dark:text-white truncate max-w-[400px] tracking-tight">
                  {title}
                </span>
              </div>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-5 text-muted-foreground opacity-40 group-hover:opacity-100 transition-opacity ml-1"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </Button>
          </DialogTrigger>

          <DialogContent className="p-0 border-0 shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.08),0_24px_48px_rgba(0,0,0,0.08)] rounded-[24px] overflow-hidden bg-white dark:bg-zinc-900 max-w-[480px] backdrop-blur-2xl">
            <DialogHeader className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-zinc-50/80 to-white dark:from-zinc-900/80 dark:to-zinc-800/80 border-b border-zinc-200/50 dark:border-zinc-700/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
                  <div className="relative size-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <span className="text-white font-semibold text-xl">#</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <DialogTitle className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight truncate">
                    {title}
                  </DialogTitle>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    Channel preferences
                  </p>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <Dialog open={editOpen} onOpenChange={handleEditOpen}>
                <DialogTrigger asChild>
                  <div
                    className={cn(
                      "group relative overflow-hidden rounded-2xl border transition-all duration-300",
                      isAdmin
                        ? "cursor-pointer bg-white dark:bg-zinc-800/50 border-zinc-200/60 dark:border-zinc-700/60 hover:border-blue-300 dark:hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-500/10"
                        : "opacity-60 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200/40 dark:border-zinc-700/40",
                    )}
                  >
                    {isAdmin && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-indigo-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                    )}

                    <div className="relative p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="size-2 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                          <p className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-[0.1em]">
                            Channel Name
                          </p>
                        </div>
                        {isAdmin && (
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2">
                            Edit
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-zinc-400 dark:text-zinc-500 text-lg font-medium">#</span>
                        <p className="text-[17px] font-semibold text-zinc-900 dark:text-white tracking-tight">
                          {title}
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[440px] rounded-[20px] border-0 shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-0 overflow-hidden bg-white dark:bg-zinc-900">
                  <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-700/50">
                    <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                      <svg className="size-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Rename channel
                    </DialogTitle>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                      Choose a unique name that describes this channel
                    </p>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                        Channel name
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 font-medium">#</span>
                        <Input
                          value={name}
                          onChange={handleChange}
                          disabled={updatingChannel}
                          autoFocus
                          required
                          minLength={3}
                          maxLength={80}
                          placeholder="e.g. budget-planning"
                          className="pl-8 h-11 rounded-xl border-zinc-300 dark:border-zinc-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all bg-white dark:bg-zinc-800"
                        />
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Use lowercase letters, numbers, and dashes
                      </p>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={updatingChannel}
                        onClick={() => setEditOpen(false)}
                        className="rounded-xl h-10 px-5 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={updatingChannel}
                        className="rounded-xl h-10 px-6 font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all"
                      >
                        {updatingChannel ? "Saving..." : "Save changes"}
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
                  type="button"
                  onClick={handleRemove}
                  disabled={!isAdmin || removingChannel}
                  className={cn(
                    "w-full group relative overflow-hidden rounded-2xl border transition-all duration-300",
                    isAdmin && !removingChannel
                      ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-red-200 dark:border-red-800/50 hover:border-red-300 dark:hover:border-red-700 hover:shadow-lg hover:shadow-red-500/15"
                      : "opacity-50 cursor-not-allowed bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-700",
                  )}
                >
                  {isAdmin && !removingChannel && (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/0 via-transparent to-rose-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  )}

                  <div className="relative flex items-center justify-between p-5">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <TrashIcon className="size-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-red-700 dark:text-red-400">
                          Delete channel
                        </p>
                        <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-0.5">
                          This action cannot be undone
                        </p>
                      </div>
                    </div>
                    <svg
                      className="size-5 text-red-400 dark:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:translate-x-0 translate-x-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-6 h-full">
        {!membersLoading && members && members.length > 0 && (
          <div className="flex items-center -space-x-2.5 mr-2 group cursor-pointer transition-transform hover:scale-105">
            {members.slice(0, 3).map((member) => (
              <Hint key={member._id} label={member.user.name || "Member"}>
                <Avatar className="size-8 border-2 border-white dark:border-black bg-secondary shadow-sm transition-transform group-hover:translate-x-[-2px]">
                  <AvatarImage
                    src={member.user.image}
                    alt={member.user.name || "Member"}
                  />
                  <AvatarFallback className="text-[10px] font-bold bg-[#6366f1] text-white">
                    {member.user.name?.charAt(0).toUpperCase() || "M"}
                  </AvatarFallback>
                </Avatar>
              </Hint>
            ))}
            {members.length > 3 && (
              <div className="size-8 rounded-full border-2 border-white dark:border-black bg-secondary flex items-center justify-center text-[11px] font-bold text-muted-foreground shadow-sm">
                +{members.length - 3}
              </div>
            )}
          </div>
        )}

        <div className="w-px h-8 bg-border/10" />
        <Button
          onClick={() => {
            const event = new CustomEvent("toggle-channel-info");
            window.dispatchEvent(event);
          }}
          variant="transparent"
          size="icon"
          className="text-muted-foreground/40 hover:text-primary transition-all p-0 h-auto w-auto"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};
