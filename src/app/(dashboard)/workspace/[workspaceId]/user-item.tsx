import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";

import { Id } from "@convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";

const userItemVariants = cva(
  "flex items-center gap-2 justify-start font-medium h-9 px-3 text-sm overflow-hidden sidebar-item-transition rounded-xl my-0.5",
  {
    variants: {
      variant: {
        default:
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
        active: "text-primary bg-primary/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

export const UserItem = ({
  id,
  label = "Member",
  image,
  variant,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant="transparent"
      className={cn(userItemVariants({ variant }))}
      size="sm"
      asChild
    >
      <Link
        href={`/workspace/${workspaceId}/member/${id}`}
        className="flex items-center gap-2.5 w-full"
      >
        <Avatar className="size-6 rounded-lg border-white/50 shadow-none shrink-0">
          <AvatarImage src={image} />
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>

        <span className="text-sm truncate opacity-90">{label}</span>
        {variant === "active" ? (
          <div className="ml-auto size-1 rounded-full bg-primary" />
        ) : (
          <div className="ml-auto size-1.5 rounded-full bg-emerald-500 opacity-60" />
        )}
      </Link>
    </Button>
  );
};
