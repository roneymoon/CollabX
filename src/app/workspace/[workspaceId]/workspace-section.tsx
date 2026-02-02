import { Hint } from "@/components/hints";
import { Button } from "@/components/ui/button";

import { useToggle } from "react-use";

import { PlusIcon } from "lucide-react";
import { FaCaretDown } from "react-icons/fa";
import { cn } from "@/lib/utils";

interface WorkspaceSectionProps {
  children: React.ReactNode;
  label: string;
  hint: string;
  onNew?: () => void;
}

export const WorkspaceSection = ({
  children,
  label,
  hint,
  onNew,
}: WorkspaceSectionProps) => {
  const [on, toggle] = useToggle(true);

  return (
    <div className="flex flex-col mt-2 px-1">
      <div className="flex items-center px-4 group mb-1">
        <Button
          variant="transparent"
          className="p-0 text-muted-foreground/40 hover:text-primary shrink-0 size-6 sidebar-item-transition rounded-md"
          onClick={toggle}
        >
          <FaCaretDown
            className={cn(
              "size-3 transition-transform duration-300 ease-out",
              !on && "-rotate-90",
            )}
          />
        </Button>

        <Button
          variant="transparent"
          size="sm"
          className="group px-2 text-foreground/50 hover:text-primary h-[28px] justify-start overflow-hidden items-center tracking-tight text-[13px] sidebar-item-transition font-sans font-semibold uppercase"
        >
          {label}
        </Button>

        {onNew && (
          <Hint label={hint} side="top" align="center">
            <Button
              onClick={onNew}
              variant="transparent"
              size="iconSm"
              className="opacity-0 group-hover:opacity-100 transition-all ml-auto p-1.5 text-muted-foreground/40 hover:text-primary hover:bg-primary/5 rounded-full size-7 shrink-0 active:scale-95"
            >
              <PlusIcon className="size-4" />
            </Button>
          </Hint>
        )}
      </div>

      <div
        className={cn(
          "transition-all duration-300 ease-out overflow-hidden",
          on ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="space-y-0.5">{children}</div>
      </div>
    </div>
  );
};
