"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Video, Info, FileText, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileRailProps {
  name: string;
  image?: string;
  status?: "available" | "busy" | "away";
  localTime?: string;
  className?: string;
}

export const ProfileRail = ({
  name,
  image,
  status = "available",
  localTime = "14:25 PM",
  className,
}: ProfileRailProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase() || "U";

  const statusColors = {
    available: "bg-emerald-500",
    busy: "bg-red-500",
    away: "bg-amber-500",
  };

  return (
    <div
      className={cn(
        "w-full h-full bg-[#FDFDFD] dark:bg-zinc-950 border-l border-black/5 dark:border-white/5 flex flex-col",
        className,
      )}
    >
      {/* Profile Section */}
      <div className="flex flex-col items-center pt-12 pb-8 px-6">
        {/* Avatar with Status Ring */}
        <div className="relative mb-6">
          <div className="relative">
            <Avatar className="size-[120px] rounded-full border-4 border-white dark:border-zinc-900 shadow-lg">
              <AvatarImage src={image} />
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            {/* Status Ring */}
            <div
              className={cn(
                "absolute bottom-2 right-2 size-5 rounded-full border-4 border-[#FDFDFD] dark:border-zinc-950",
                statusColors[status],
              )}
            />
          </div>
        </div>

        {/* Name */}
        <h2 className="text-[28px] font-serif font-normal text-foreground tracking-tight mb-1">
          {name}
        </h2>
        <p className="text-[13px] text-muted-foreground/60 font-light tracking-wide uppercase">
          Senior Project Architect
        </p>
      </div>

      {/* Status Cards */}
      <div className="px-6 space-y-3 mb-8">
        {/* Local Time Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 border border-black/5 dark:border-white/5">
          <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide uppercase mb-1.5">
            Local Time
          </p>
          <p className="text-[15px] text-foreground font-medium">{localTime}</p>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 border border-black/5 dark:border-white/5">
          <p className="text-[11px] text-muted-foreground/60 font-medium tracking-wide uppercase mb-1.5">
            Status
          </p>
          <div className="flex items-center gap-2">
            <div className={cn("size-2 rounded-full", statusColors[status])} />
            <p className="text-[15px] text-foreground font-medium capitalize">
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Shared Files */}
      <div className="px-6 flex-1">
        <h3 className="text-[11px] text-muted-foreground/60 font-medium tracking-wide uppercase mb-4">
          Recent Shared Files
        </h3>

        <div className="space-y-2">
          {/* File Card 1 */}
          <div className="group bg-white dark:bg-zinc-900 rounded-xl px-4 py-3.5 border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <FileText
                  className="size-5 text-blue-600 dark:text-blue-400"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  q1-budget-v2.pdf
                </p>
                <p className="text-[11px] text-muted-foreground/60 font-light">
                  Shared 25 days • 4.2 MB
                </p>
              </div>
            </div>
          </div>

          {/* File Card 2 */}
          <div className="group bg-white dark:bg-zinc-900 rounded-xl px-4 py-3.5 border border-black/5 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all duration-200 ease-in-out cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                <ImageIcon
                  className="size-5 text-green-600 dark:text-green-400"
                  strokeWidth={1.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground truncate">
                  site-inspection-01.jpg
                </p>
                <p className="text-[11px] text-muted-foreground/60 font-light">
                  Shared yesterday • 1.8 MB
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
