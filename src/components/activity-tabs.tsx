"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type TabType = "all" | "mentions" | "updates";

interface ActivityTabsProps {
    onTabChange?: (tab: TabType) => void;
}

export const ActivityTabs = ({ onTabChange }: ActivityTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>("all");

    const handleTabClick = (tab: TabType) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    return (
        <div className="border-b border-black/5 dark:border-white/5">
            <div className="flex gap-8">
                <button
                    onClick={() => handleTabClick("all")}
                    className={cn(
                        "pb-4 text-[14px] font-medium transition-colors relative",
                        activeTab === "all"
                            ? "text-foreground"
                            : "text-muted-foreground/60 hover:text-foreground/80"
                    )}
                >
                    All Activity
                    {activeTab === "all" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => handleTabClick("mentions")}
                    className={cn(
                        "pb-4 text-[14px] font-medium transition-colors relative",
                        activeTab === "mentions"
                            ? "text-foreground"
                            : "text-muted-foreground/60 hover:text-foreground/80"
                    )}
                >
                    Mentions
                    {activeTab === "mentions" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                </button>
                <button
                    onClick={() => handleTabClick("updates")}
                    className={cn(
                        "pb-4 text-[14px] font-medium transition-colors relative",
                        activeTab === "updates"
                            ? "text-foreground"
                            : "text-muted-foreground/60 hover:text-foreground/80"
                    )}
                >
                    Updates
                    {activeTab === "updates" && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
                    )}
                </button>
            </div>
        </div>
    );
};
