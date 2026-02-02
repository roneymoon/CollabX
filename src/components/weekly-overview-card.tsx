"use client";

interface WeeklyOverviewCardProps {
    totalInteractions: number;
    percentageChange: number;
    activeChannel: string;
}

export const WeeklyOverviewCard = ({
    totalInteractions,
    percentageChange,
    activeChannel,
}: WeeklyOverviewCardProps) => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between">
                {/* Left: Stats */}
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/60 uppercase mb-3">
                        Weekly Overview
                    </span>
                    <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-[64px] font-bold text-foreground leading-none">
                            {totalInteractions}
                        </span>
                        <span className="text-[14px] font-semibold text-emerald-500 flex items-center gap-1">
                            ↑{Math.abs(percentageChange)}%
                        </span>
                    </div>
                    <span className="text-[13px] text-muted-foreground/70">
                        Total interactions this week
                    </span>
                </div>

                {/* Center: Bar Chart */}
                <div className="flex items-end gap-2 px-12 h-24">
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-12" />
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-16" />
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-10" />
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-14" />
                    <div className="w-10 bg-primary rounded-t-lg h-24 shadow-lg shadow-primary/20" />
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-16" />
                    <div className="w-10 bg-gray-200 dark:bg-zinc-700 rounded-t-lg h-18" />
                </div>

                {/* Right: Most Active Channel */}
                <div className="text-right">
                    <span className="text-[11px] font-medium tracking-[0.15em] text-muted-foreground/60 uppercase block mb-2">
                        Most Active Channel
                    </span>
                    <span className="text-[15px] font-semibold text-foreground">
                        # {activeChannel}
                    </span>
                </div>
            </div>
        </div>
    );
};
