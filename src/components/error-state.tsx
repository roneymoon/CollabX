import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't load this content. Please try again.",
    onRetry,
}: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="size-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3">
                <AlertTriangle className="size-5 text-destructive" />
            </div>
            <p className="text-sm font-medium text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground/60 text-center mb-4">
                {message}
            </p>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="text-xs"
                >
                    Try again
                </Button>
            )}
        </div>
    );
};
