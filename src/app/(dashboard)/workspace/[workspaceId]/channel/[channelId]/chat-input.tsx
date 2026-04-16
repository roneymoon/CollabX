import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useSetTypingIndicator } from "@/features/conversations/api/use-set-typing-indicator";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId?: Id<"conversations"> | null;
}

type CreateMessageValues = {
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
  body: string;
  workspaceId: Id<"workspaces">;
  image: Id<"_storage"> | undefined;
};

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const editorRef = useRef<Quill | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();
  const { mutate: setTyping } = useSetTypingIndicator();

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!conversationId) return;

    // Set typing to true
    setTyping({ conversationId, isTyping: true });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to clear typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setTyping({ conversationId, isTyping: false });
    }, 3000);
  }, [conversationId, setTyping]);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    console.log({ body, image });
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId: conversationId ? undefined : channelId,
        conversationId: conversationId ? conversationId : undefined,
        workspaceId,
        body,
        image: undefined,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        if (!url) {
          throw new Error("Failed to generate upload url");
        }

        console.log({ url });

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": image.type },
          body: image,
        });

        if (!result.ok) {
          throw new Error("Failed to upload image");
        }

        console.log({ result });

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });

      // Clear typing indicator on send
      if (conversationId) {
        setTyping({ conversationId, isTyping: false });
        // Clear the timeout as well
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }

    // editorRef?.current?.setContents([])
  };

  return (
    <div className="px-5 pb-6 w-full sticky bottom-0 z-10 bg-linear-to-t from-background via-background/90 to-transparent">
      <div className="max-w-[1000px] mx-auto">
        <Editor
          key={editorKey}
          placeholder={placeholder}
          onSubmit={handleSubmit}
          onChange={handleTyping}
          disabled={isPending}
          innerRef={editorRef}
        />
        <div className="flex justify-center mt-2.5">
          <p className="text-[9px] font-bold text-muted-foreground/15 uppercase tracking-[0.25em] select-none">
            Shift + Enter to add a new line
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
