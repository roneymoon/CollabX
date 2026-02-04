"use client";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./header";
import { Loader } from "lucide-react";
import ChatInput from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useEffect } from "react";

const ChannelIdPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { results, status, loadMore } = useGetMessages({
    channelId,
  });

  const { data: channel, isLoading: channelLoading } = useGetChannel({
    id: channelId,
  });

  useEffect(() => {
    if (channelLoading || status === "LoadingFirstPage") return;

    if (!channel) {
      router.replace(`/workspace/${workspaceId}`);
    }
  }, [channel, channelLoading, status, router, workspaceId]);

  if (channelLoading || status === "LoadingFirstPage") {
    return (
      <div className="h-full flex-1 flex items-center justify-center">
        <Loader className="animate-spin size-5 text-muted-foreground" />
      </div>
    );
  }

  if (!channel) {
    return null; // Effect handles redirect
  }

  return (
    <div className="flex flex-col h-full">
      <Header title={channel.name} />
      <MessageList
        channelName={channel.name}
        channelCreationTime={channel._creationTime}
        data={results}
        loadMore={loadMore}
        isLoadingMore={status === "LoadingMore"}
        canLoadMore={status === "CanLoadMore"}
        variant="channel"
      />
      <ChatInput placeholder={`Message # ${channel.name}`} />
    </div>
  );
};

export default ChannelIdPage;
