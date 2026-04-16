import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";

import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const sidebarItemVariants = cva(
  "flex items-center gap-3 justify-start font-medium h-10 px-4 text-sm overflow-hidden sidebar-item-transition rounded-2xl my-0.5 relative group",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground/60 hover:bg-primary/5 hover:text-foreground/80",
        active: "text-primary bg-primary/5 border-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

export const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant="transparent"
      size="sm"
      className={cn(sidebarItemVariants({ variant: variant }))}
      asChild
    >
      <Link
        href={`/workspace/${workspaceId}/channel/${id}`}
        className="flex items-center w-full"
      >
        <Icon className="size-4 mr-3 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />
        <span className="text-[14px] font-medium tracking-tight truncate group-hover:underline">
          {label}
        </span>
        {variant === "active" && (
          <div className="size-1.5 rounded-full bg-primary absolute right-4 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
        )}
      </Link>
    </Button>
  );
};
