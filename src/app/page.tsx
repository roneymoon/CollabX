"use client";

import { UserButton } from "@/features/auth/components/user-button";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const { data, isLoading } = useGetWorkspaces();
  const router = useRouter();

  const workspaceId = data?.length ? data[0]?._id : null;

  const [open, setOpen] = useCreateWorkspaceModal();


  useEffect(() => {
    if (isLoading) return;

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`);
    } else if(!open) {
      setOpen(true);
    }
  }, [workspaceId, isLoading, open, setOpen, router]);

  return (
    <div className="h-full text-rose-300">
      {/* <UserButton /> */}
    </div>
  );
}
