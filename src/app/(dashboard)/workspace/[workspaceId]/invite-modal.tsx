import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { useConfirm } from "@/hooks/use-confirm";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface InviteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  name: string;
  joinCode: string;
}

export const InviteModal = ({
  open,
  setOpen,
  name,
  joinCode,
}: InviteModalProps) => {
  const [ConfirmDialog, confirm] = useConfirm(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one.",
  );
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useNewJoinCode();

  const handleCopy = () => {
    const inviteLink = `${window.location.origin}/join/${workspaceId}`;

    navigator.clipboard
      .writeText(inviteLink)
      .then(() => toast.success("Invite link copied to clipboard"));
  };

  const handleNewCode = async () => {
    const ok = await confirm();

    if (!ok) return;

    mutate(
      { workspaceId },
      {
        onSuccess: () => {
          toast.success("Invite code generated");
        },
        onError: () => {
          toast.error("Failed to regenerate invite code");
        },
      },
    );
  };

  return (
    <>
      <ConfirmDialog />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md p-10 bg-white dark:bg-zinc-950 border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[40px] gap-0">
          <div className="relative">
          
            <DialogHeader className="p-0 space-y-3 flex flex-col items-center">
              <DialogTitle className="text-3xl font-medium tracking-tight text-[#111827] dark:text-white">
                Invite to{" "}
                <span className="font-serif italic text-indigo-500">
                  {name}
                </span>
              </DialogTitle>
              <DialogDescription className="text-[15px] leading-relaxed text-muted-foreground/70 max-w-[280px] text-center">
                Share the code below to grant immediate access to your
                workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-12 flex flex-col items-center gap-y-10">
              {/* Code Card */}
              <div className="w-full bg-[#f9fafb] dark:bg-zinc-900/50 rounded-[28px] py-12 px-6 border border-black/5 dark:border-white/5 flex flex-col items-center gap-y-6 relative group overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent dark:from-white/5 pointer-events-none" />

                <p className="text-[64px] font-bold tracking-[0.15em] text-indigo-500/90 dark:text-indigo-400 font-sans leading-none z-10 transition-transform group-hover:scale-105 duration-500 uppercase">
                  {joinCode}
                </p>

                <Button
                  disabled={isPending}
                  onClick={handleNewCode}
                  variant="transparent"
                  className="z-10 text-[10px] font-bold text-muted-foreground/40 hover:text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-x-2 transition-all group/btn"
                >
                  <RefreshCcw
                    className={cn(
                      "size-3 transition-transform duration-500",
                      isPending && "animate-spin",
                      "group-hover/btn:rotate-180",
                    )}
                  />
                  New code
                </Button>
              </div>

              {/* Action Button */}
              <Button
                onClick={handleCopy}
                disabled={isPending}
                className="w-full h-14 bg-[#1a1918] hover:bg-black text-white rounded-xl text-[15px] font-medium transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-x-3"
              >
                <CopyIcon className="size-4" />
                Copy invite link
              </Button>

              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                Code expires in 24 hours
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
