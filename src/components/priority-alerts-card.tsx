"use client";

import { Zap } from "lucide-react";

export const PriorityAlertsCard = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/5 dark:border-white/5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <Zap className="size-4 text-primary" strokeWidth={2} fill="currentColor" />
                <span className="text-[11px] font-medium tracking-[0.15em] text-primary uppercase">
                    Priority Alerts
                </span>
            </div>

            {/* Alert Item */}
            <div className="space-y-2">
                <div className="flex items-start gap-2">
                    <div className="size-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                        <h3 className="text-[14px] font-semibold text-foreground mb-1">
                            Deadline Approaching
                        </h3>
                        <p className="text-[13px] text-muted-foreground/70 leading-relaxed">
                            Budget approval for Project Nova is due in 2 hours.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
