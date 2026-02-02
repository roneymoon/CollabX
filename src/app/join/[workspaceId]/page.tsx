"use client";

import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { useJoin } from "@/features/workspaces/api/use-join";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { toast } from "sonner";


import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import VerificationInput from "react-verification-input";

const JoinPage = () => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useJoin();
  const { data, isLoading } = useGetWorkspaceInfo({ id: workspaceId });

  const isMember = useMemo(() => data?.isMember, [data?.isMember]);

  useEffect(() => {
    if (isMember) {
      router.push(`/workspace/${workspaceId}`); 
    }
  }, [isMember, router, workspaceId]);

  const handleComplete = (value: string) => {
    if (isPending) return;

    mutate(
      { workspaceId, joinCode: value },
      {
        onSuccess: (id) => {
          toast.success("Welcome to the workspace ✨");
          router.replace(`/workspace/${id}`);
        },
        onError: () => {
          toast.error("Invalid invite code");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#f7f5ff] to-[#fdfcff]">
        <Loader className="size-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-[#f7f5ff] via-white to-[#fdfcff] p-6">
      <div className="w-full max-w-md rounded-2xl border border-purple-100 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(124,58,237,0.15)] p-10 flex flex-col gap-y-10">
        
        {/* Logo */}
        <div className="flex justify-center">
          <Image src="/logo.svg" width={56} height={56} alt="Logo" />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center gap-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Join <span className="text-purple-600">{data?.name}</span>
          </h1>
          <p className="text-sm text-gray-500">
            Enter the 6-digit invite code to continue
          </p>
        </div>

        {/* Verification Input */}
        <div className="flex justify-center">
          <VerificationInput
            length={6}
            autoFocus
            onComplete={handleComplete}
            classNames={{
              container: "flex gap-x-3",
              character: cn(
                "uppercase h-14 w-12 rounded-xl",
                "border bg-white text-xl font-semibold",
                "flex items-center justify-center",
                "transition-all duration-200 ease-out",
                "border-gray-200 text-gray-900 shadow-sm",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500",
                "data-[state=filled]:border-purple-500 data-[state=filled]:shadow-md",
                isPending &&
                  "opacity-50 pointer-events-none select-none"
              ),
              characterInactive:
                "bg-gray-50 text-gray-400 border-gray-200",
              characterSelected:
                "border-purple-600 ring-2 ring-purple-500/30 shadow-lg scale-[1.04]",
            }}
          />
        </div>

        {/* Loading hint */}
        {isPending && (
          <div className="flex items-center justify-center gap-x-2 text-sm text-purple-600">
            <Loader className="size-4 animate-spin" />
            Joining workspace…
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-center">
          <Button
            size="lg"
            variant="ghost"
            className="text-gray-500 hover:text-purple-600"
            asChild
          >
            <Link href="/">← Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;
