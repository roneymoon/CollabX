"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from "lucide-react";
import { WeeklyOverviewCard } from "@/components/weekly-overview-card";
import { ActivityTabs } from "@/components/activity-tabs";
import { PriorityAlertsCard } from "@/components/priority-alerts-card";
import { ActiveUsersWidget } from "@/components/active-users-widget";
import { ChannelsList } from "@/components/channels-list";

const ActivityPage = () => {
  return (
    <div className="h-full flex bg-[#FDFDFD] dark:bg-black">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-12 pt-8 pb-6 flex items-start justify-between border-b border-black/5 dark:border-white/5">
          <div>
            <h1 className="text-[40px] font-normal text-foreground tracking-tight leading-none mb-2">
              Activity
            </h1>
            <p className="text-[14px] text-muted-foreground/70">
              You have 12 new notifications across 3 channels.
            </p>
          </div>
          <button className="px-5 py-2.5 rounded-xl border border-black/10 dark:border-white/10 text-[13px] font-medium text-foreground hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
            Mark all as read
          </button>
        </div>

        {/* Weekly Overview Card */}
        <div className="px-12 pt-8 pb-6">
          <WeeklyOverviewCard
            totalInteractions={48}
            percentageChange={12}
            activeChannel="budget-scheme"
          />
        </div>

        {/* Tabs */}
        <div className="px-12 mb-6">
          <ActivityTabs />
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto px-12 pb-8">
          <div className="max-w-4xl space-y-4">
            {/* Mention Notification */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-all duration-200 ease-out cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="size-11 rounded-full border-2 border-white dark:border-zinc-800 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    AR
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[14px] font-bold text-foreground">
                        Alex Rivera
                      </span>
                      <span className="text-[13px] text-muted-foreground/60">
                        mentioned you in
                      </span>
                      <span className="text-[13px] font-medium text-blue-600 dark:text-blue-400">
                        #budget-scheme
                      </span>
                    </div>
                    <span className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground/50 uppercase shrink-0 ml-4">
                      12M AGO
                    </span>
                  </div>
                  <p className="text-[14px] text-muted-foreground/80 italic leading-relaxed">
                    "Can you review the latest Figma layouts when you get a chance?"
                  </p>
                </div>
              </div>
            </div>

            {/* Reaction Notification */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-all duration-200 ease-out cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="size-11 rounded-full border-2 border-white dark:border-zinc-800 shrink-0">
                  <AvatarFallback className="bg-emerald-500/10 text-emerald-600 text-sm font-semibold">
                    SC
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[14px] font-bold text-foreground">
                        Sarah Chen
                      </span>
                      <span className="text-[13px] text-muted-foreground/60">
                        reacted to your message
                      </span>
                    </div>
                    <span className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground/50 uppercase shrink-0 ml-4">
                      1H AGO
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-800 rounded-full px-3 py-1.5">
                      <span className="text-base">👍</span>
                      <span className="text-[12px] font-medium text-muted-foreground">
                        3
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-zinc-800 rounded-full px-3 py-1.5">
                      <span className="text-base">🎉</span>
                      <span className="text-[12px] font-medium text-muted-foreground">
                        2
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* File Share Notification */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5 hover:scale-[1.01] transition-all duration-200 ease-out cursor-pointer">
              <div className="flex items-start gap-4">
                <Avatar className="size-11 rounded-full border-2 border-white dark:border-zinc-800 shrink-0">
                  <AvatarFallback className="bg-amber-500/10 text-amber-600 text-sm font-semibold">
                    JW
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-[14px] font-bold text-foreground">
                        James Wilson
                      </span>
                      <span className="text-[13px] text-muted-foreground/60">
                        shared a file in
                      </span>
                      <span className="text-[13px] font-medium text-blue-600 dark:text-blue-400">
                        #marketing
                      </span>
                    </div>
                    <span className="text-[11px] font-medium tracking-[0.1em] text-muted-foreground/50 uppercase shrink-0 ml-4">
                      3H AGO
                    </span>
                  </div>

                  {/* File Card */}
                  <div className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 border border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <FileText
                          className="size-6 text-blue-600 dark:text-blue-400"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-foreground truncate">
                          Q4_Market_Report_Draft.pdf
                        </p>
                        <p className="text-[12px] text-muted-foreground/60">
                          2.4 MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 h-full bg-[#F9FAFB] dark:bg-zinc-950 border-l border-black/5 dark:border-white/5 overflow-y-auto p-6 space-y-5">
        <PriorityAlertsCard />
        <ActiveUsersWidget />
        <ChannelsList />
      </div>
    </div>
  );
};

export default ActivityPage;
