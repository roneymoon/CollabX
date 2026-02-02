import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarButtonProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
}

export const SidebarButton = ({
  icon: Icon,
  isActive,
  label,
}: SidebarButtonProps) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center justify-center cursor-pointer group relative w-full px-2 py-1">
            <Button
              variant="transparent"
              className={cn(
                "size-11 p-0 rounded-2xl transition-all duration-300 ease-out relative overflow-hidden",
                isActive
                  ? "text-primary bg-primary/[0.08] shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
                  : "text-muted-foreground/60 hover:text-primary hover:bg-primary/[0.05] hover:scale-105 active:scale-95",
              )}
            >
              {/* Active Glow Effect */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/5 blur-xl animate-pulse" />
              )}

              <Icon
                strokeWidth={isActive ? 2 : 1.5}
                className={cn(
                  "size-6 transition-all duration-500 relative z-10",
                  isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.3)]" : "scale-100 group-hover:scale-110",
                )}
              />
            </Button>

            {/* Active Indicator Line */}
            {isActive && (
              <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)] animate-in slide-in-from-left duration-300" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="bg-zinc-900 border-zinc-800 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xl backdrop-blur-md">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
