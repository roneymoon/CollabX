"use client";

import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hints";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Doc } from "../../../../convex/_generated/dataModel";
import { ChevronDown, ListFilter, SquarePen } from "lucide-react";
import { PreferenceModal } from "./preference-modal";
import { InviteModal } from "./invite-modal";
import { useState } from "react";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

export const WorkspaceHeader = ({
  workspace,
  isAdmin,
}: WorkspaceHeaderProps) => {
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <InviteModal
        open={inviteOpen}
        setOpen={setInviteOpen}
        name={workspace?.name}
        joinCode={workspace.joinCode}
      />
      <PreferenceModal
        open={preferencesOpen}
        setOpen={setPreferencesOpen}
        initialValue={workspace.name}
      />

      <div className="flex items-center justify-between px-6 py-8 gap-0.5 min-w-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="transparent"
              className="group flex items-center justify-start gap-x-4 p-0 hover:bg-transparent"
            >
              <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 flex items-center justify-center text-primary font-sans font-bold text-xl premium-lift border border-primary/20 shadow-sm">
                {workspace.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col items-start overflow-hidden text-left">
                <div className="flex items-center gap-x-2">
                  <p className="font-sans font-bold text-[#111827] dark:text-white text-lg tracking-tight truncate">
                    {workspace.name}
                  </p>
                  <ChevronDown className="size-4 text-muted-foreground/30 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
                  PRO WORKSPACE
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 shadow-2xl border-border/10 rounded-2xl p-2 bg-white/95 dark:bg-black/95 backdrop-blur-xl"
            side="bottom"
            align="start"
          >
            <DropdownMenuItem className="cursor-pointer capitalize focus:bg-primary/5 rounded-xl p-3">
              <div className="size-10 overflow-hidden relative bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 text-primary font-sans font-bold text-lg rounded-xl flex items-center justify-center mr-3 border border-primary/20">
                {workspace.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex flex-col items-start">
                <p className="font-sans font-semibold text-sm">{workspace.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Active Workspace
                </p>
              </div>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator className="my-2 opacity-50" />
                <DropdownMenuItem
                  className="cursor-pointer py-2.5 rounded-lg px-3 focus:bg-primary/5 text-sm"
                  onClick={() => setInviteOpen(true)}
                >
                  Invite people to this workspace
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="cursor-pointer py-2.5 rounded-lg px-3 focus:bg-primary/5 text-sm"
                  onClick={() => setPreferencesOpen(true)}
                >
                  Preferences
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1 shrink-0">
          <Hint label="New message" side="bottom">
            <Button
              variant="transparent"
              size="iconSm"
              className="text-muted-foreground hover:text-primary transition-colors p-0 h-auto w-auto"
              onClick={() => { }}
            >
              <SquarePen className="size-5" />
            </Button>
          </Hint>
        </div>
      </div>
    </>
  );
};
