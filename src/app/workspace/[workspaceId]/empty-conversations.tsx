import { MessageSquare } from "lucide-react";

export const EmptyConversations = () => {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="size-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <MessageSquare className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
                No conversations yet
            </p>
            <p className="text-xs text-muted-foreground/60 text-center">
                Click "New Message" to start chatting
            </p>
        </div>
    );
};
