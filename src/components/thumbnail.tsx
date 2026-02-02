import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface ThumbnailProps {
  url: string | null | undefined;
  className?: string;
}

export const Thumbnail = ({ url, className }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      {/* Thumbnail */}
      <DialogTrigger asChild>
        <button
          className={cn(
            "relative mt-2 w-fit max-w-[320px] rounded-md overflow-hidden border bg-muted focus:outline-none focus:ring-2 focus:ring-sky-500/50",
            "hover:shadow-md transition-all duration-300",
            "hover:scale-[1.01] active:scale-[0.98]",
            className
          )}
        >
          <img
            src={url}
            alt="Message image"
            width={320}
            height={200}
            className="object-cover w-full h-auto"
          />
        </button>
      </DialogTrigger>

      {/* Enlarged View */}
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[95vw] max-h-[95vh] p-0 border-none bg-transparent shadow-none",
          "flex items-center justify-center pointer-events-none"
        )}
      >
        {/* Accessible title */}
        <VisuallyHidden>
          <DialogTitle>Image preview</DialogTitle>
        </VisuallyHidden>

        {/* Backdrop (Explicitly customized if needed, but DialogOverlay usually handles it) */}
        {/* We can use the className on DialogContent to affect the overlay if the component supports it, 
            but here we modify the overlay in dialog.tsx if needed or rely on default plus custom classes. 
            Since we can't easily change DialogOverlay from here without editing dialog.tsx (which we saw has bg-black/50),
            we'll focus on the content and close button. */}

        {/* Header/Actions */}
        <div className="fixed top-4 right-4 z-50 pointer-events-auto">
          <DialogClose asChild>
            <button
              className={cn(
                "group flex items-center justify-center rounded-full bg-black/50 text-white/70 transition-all duration-200",
                "hover:bg-black/70 hover:text-white hover:scale-105 active:scale-95 p-2"
              )}
            >
              <XIcon className="h-4 w-4" />
            </button>
          </DialogClose>
        </div>

        {/* Image container with smooth zoom */}
        <div className="relative flex items-center justify-center w-full h-full pointer-events-none p-12">
          <img
            src={url}
            alt="Full size"
            className={cn(
              "max-w-full max-h-[85vh] rounded-xl shadow-2xl object-contain pointer-events-auto",
              "animate-in fade-in-0 zoom-in-90 duration-500 ease-out"
            )}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
