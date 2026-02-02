"use client";

import {
  MutableRefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  Bold,
  CodeIcon,
  Heading1,
  Heading2,
  ImageIcon,
  Italic,
  Link2Icon,
  ListIcon,
  SendHorizontal,
  Smile,
  Strikethrough,
  XIcon,
} from "lucide-react";

import "quill/dist/quill.snow.css";

import { Button } from "./ui/button";
import { Hint } from "./hints";
import { EmojiPopover } from "./emoji-popover";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface EditorValue {
  image: File | null;
  body: string;
}

interface EditorProps {
  onSubmit: ({ image, body }: EditorValue) => void;
  onCancel?: () => void;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  innerRef?: MutableRefObject<any | null>;
  variant?: "create" | "update";
  onChange?: () => void;
}

const Editor = ({
  onCancel,
  onSubmit,
  placeholder = "Write something...",
  defaultValue = [],
  disabled = false,
  innerRef,
  variant = "create",
  onChange,
}: EditorProps) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const submitRef = useRef(onSubmit);
  const placeholderRef = useRef(placeholder);
  const defaultValueRef = useRef(defaultValue);
  const disabledRef = useRef(disabled);
  const variantRef = useRef(variant);

  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any | null>(null);
  const initializedRef = useRef(false);

  useLayoutEffect(() => {
    submitRef.current = onSubmit;
    placeholderRef.current = placeholder;
    defaultValueRef.current = defaultValue;
    disabledRef.current = disabled;
    variantRef.current = variant;
  });

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let textChangeHandler: (() => void) | null = null;

    const init = async () => {
      if (!containerRef.current) return;

      const Quill = (await import("quill")).default;

      const editorEl = document.createElement("div");
      containerRef.current.appendChild(editorEl);

      const quill = new Quill(editorEl, {
        theme: "snow",
        placeholder: placeholderRef.current,
        modules: {
          toolbar: false,
        },
      });

      quillRef.current = quill;

      if (innerRef) {
        innerRef.current = quill;
      }

      // Handle content initialization based on variant
      if (variantRef.current === "update" && defaultValueRef.current) {
        // For update mode, convert HTML string to Quill Delta
        if (typeof defaultValueRef.current === "string") {
          // Use Quill's clipboard to convert HTML to Delta format
          const delta = quill.clipboard.convert({ html: defaultValueRef.current });
          quill.setContents(delta, "silent");
        } else {
          // If already in Delta format, use directly
          quill.setContents(defaultValueRef.current, "silent");
        }
      } else {
        // For create mode, use provided value or empty
        quill.setContents(defaultValueRef.current || []);
      }

      setText(quill.getText());

      textChangeHandler = () => {
        setText(quill.getText());
        onChange?.();
      };

      quill.on("text-change", textChangeHandler);
      quill.focus();
    };

    init();

    return () => {
      if (quillRef.current && textChangeHandler) {
        quillRef.current.off("text-change", textChangeHandler);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      quillRef.current = null;
      if (innerRef?.current) innerRef.current = null;
    };
  }, []);

  const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

  // Keyboard shortcuts for update mode
  useEffect(() => {
    if (variant !== "update" || !quillRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        onCancel?.();
      }

      // Cmd/Ctrl + Enter to save
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isEmpty) {
          handleSubmit();
        }
      }
    };

    const editorEl = containerRef.current?.querySelector(".ql-editor");
    if (editorEl) {
      editorEl.addEventListener("keydown", handleKeyDown as any);
    }

    return () => {
      if (editorEl) {
        editorEl.removeEventListener("keydown", handleKeyDown as any);
      }
    };
  }, [variant, isEmpty, onCancel]);

  const toggleToolbar = (format: string, value?: any) => {
    const quill = quillRef.current;
    if (!quill) return;

    if (format === "header") {
      const current = quill.getFormat();
      quill.format("header", current.header === value ? false : value);
      return;
    }

    const current = quill.getFormat();
    quill.format(format, !current[format]);
  };

  const onEmojiSelect = (emoji: string) => {
    const quill = quillRef.current;
    if (!quill) return;

    const range = quill.getSelection();
    const index = range?.index ?? quill.getLength();

    quill.insertText(index, emoji);
    quill.setSelection(index + emoji.length);
    quill.focus();
  };

  const handleSubmit = () => {
    if (!quillRef.current || isEmpty) return;

    submitRef.current({
      body: quillRef.current.root.innerHTML,
      image,
    });

    quillRef.current.setText("");
    setImage(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col w-full">
      <input
        type="file"
        accept="image/*"
        ref={imageInputRef}
        className="hidden"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

      <div
        className={cn(
          "flex flex-col w-full",
          variant === "update"
            ? // Premium floating card for edit mode - Natural shadow system
            "bg-white/98 dark:bg-zinc-900/98 backdrop-blur-md rounded-2xl ring-1 ring-zinc-200/80 dark:ring-zinc-700/80 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04)] p-3 transition-all duration-200 ease-out hover:shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_8px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.04)]"
            : // Clean card for create mode
            "flex flex-col rounded-[24px] border border-border/10 bg-white/70 dark:bg-black/70 backdrop-blur-2xl p-3 px-5 transition-all duration-300 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.1)] glass-card",
          disabled && "opacity-50"
        )}
      >
        <div
          ref={containerRef}
          className={cn(
            "quill-editor-container-refined",
            variant === "update"
              ? "min-h-[100px] rounded-xl bg-zinc-50/50 dark:bg-zinc-800/30 ring-1 ring-zinc-200/60 dark:ring-zinc-700/60 px-3 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-400/20 focus-within:ring-offset-2 focus-within:bg-white dark:focus-within:bg-zinc-800/60"
              : "min-h-[44px]"
          )}
        />

        {image && (
          <div className="p-2 pt-1">
            <div className="relative size-[64px] group ring-2 ring-white rounded-xl overflow-hidden shadow-sm">
              <Hint label="Remove image">
                <button
                  onClick={() => {
                    setImage(null);
                    if (imageInputRef.current) imageInputRef.current.value = "";
                  }}
                  className="absolute top-0.5 right-0.5 z-10 flex size-5 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white shadow-sm transition-transform hover:scale-110 active:scale-95"
                >
                  <XIcon className="size-3" />
                </button>
              </Hint>

              <Image
                src={URL.createObjectURL(image)}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        )}

        <div
          className={cn(
            "flex items-center justify-between",
            variant === "update"
              ? "pt-3 mt-1" // Minimal spacing for edit mode
              : "px-1 pt-3" // Original spacing for create mode
          )}
        >
          <div className="flex items-center gap-x-0.5">
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("bold")}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Bold className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("italic")}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Italic className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("strike")}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Strikethrough className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <div className="w-px h-3 bg-border/40 mx-1.5" />
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("header", 1)}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Heading1 className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("header", 2)}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Heading2 className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <div className="w-px h-3 bg-border/40 mx-1.5" />
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => { }}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <Link2Icon className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("list")}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <ListIcon className="size-[15px]" strokeWidth={2.5} />
            </Button>
            <Button
              size="iconSm"
              variant="transparent"
              onClick={() => toggleToolbar("code-block")}
              className="text-muted-foreground/40 hover:text-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all size-8 rounded-lg"
            >
              <CodeIcon className="size-[15px]" strokeWidth={2.5} />
            </Button>
          </div>

          <div className="flex items-center gap-x-2">
            <EmojiPopover hint="Emoji" onEmojiSelect={onEmojiSelect}>
              <Button
                size="iconSm"
                variant="transparent"
                className="text-muted-foreground/40 hover:text-foreground transition-all size-8"
              >
                <Smile className="size-[18px]" />
              </Button>
            </EmojiPopover>
            {variant === "create" && (
              <Button
                size="iconSm"
                variant="transparent"
                onClick={() => imageInputRef.current?.click()}
                className="text-muted-foreground/40 hover:text-foreground transition-all size-8"
              >
                <ImageIcon className="size-[18px]" />
              </Button>
            )}
            <div className="w-px h-3 bg-border/40 mx-1" />
            {variant === "create" ? (
              <Button
                disabled={disabled || isEmpty}
                onClick={handleSubmit}
                className={cn(
                  "rounded-full size-10 flex items-center justify-center p-0 transition-all duration-300",
                  isEmpty
                    ? "bg-secondary text-muted-foreground/20"
                    : "bg-[#4a154b] dark:bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95",
                )}
              >
                <SendHorizontal className="size-5" />
              </Button>
            ) : (
              <div className="flex items-center justify-end gap-2 w-full">
                {/* Action Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-5 rounded-lg font-medium text-[13px] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 ease-out"
                  onClick={onCancel}
                  disabled={disabled}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-9 px-6 rounded-lg bg-[#007a5a] hover:bg-[#006644] dark:bg-[#007a5a] dark:hover:bg-[#006644] text-white font-semibold text-[13px] shadow-sm hover:shadow-md transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={disabled || isEmpty}
                >
                  Save changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
