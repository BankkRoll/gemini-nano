// src/components/chat/auto-textarea.tsx
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useImperativeHandle } from "react";

interface UseAutosizeTextAreaProps {
  textAreaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  minHeight?: number;
  maxHeight?: number;
  triggerAutoSize: string;
  onSend?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const useAutosizeTextArea = ({
  textAreaRef,
  triggerAutoSize,
  maxHeight = Number.MAX_SAFE_INTEGER,
  minHeight = 0,
  onSend,
  onChange,
}: UseAutosizeTextAreaProps) => {
  const [init, setInit] = React.useState(true);

  const resizeTextarea = () => {
    const offsetBorder = 2;
    if (textAreaRef.current) {
      const textarea = textAreaRef.current;
      textarea.style.height = "auto";
      textarea.style.minHeight = `${minHeight + offsetBorder}px`;
      textarea.style.maxHeight = `${maxHeight}px`;

      const scrollHeight = textarea.scrollHeight;
      if (scrollHeight > maxHeight) {
        textarea.style.height = `${maxHeight}px`;
      } else {
        textarea.style.height = `${scrollHeight + offsetBorder}px`;
      }
    }
  };

  React.useEffect(() => {
    resizeTextarea();
  }, [textAreaRef, triggerAutoSize, init, maxHeight, minHeight]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const textarea = event.target as HTMLTextAreaElement;
        const selectionStart = textarea.selectionStart || 0;
        const selectionEnd = textarea.selectionEnd || 0;
        const value = textarea.value;

        if (selectionStart === selectionEnd && selectionEnd === value.length) {
          textarea.value = "";
          resizeTextarea();
          onSend?.();
        } else {
          const newValue =
            value.substring(0, selectionStart) +
            "\n" +
            value.substring(selectionEnd);

          textarea.value = newValue;

          const syntheticEvent = {
            target: textarea,
            currentTarget: textarea,
            type: "change",
          } as React.ChangeEvent<HTMLTextAreaElement>;

          onChange?.(syntheticEvent);
        }
      }
    };

    const textarea = textAreaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [textAreaRef, onSend, onChange]);

  return { resizeTextarea };
};

export type AutosizeTextAreaRef = {
  textArea: HTMLTextAreaElement;
  maxHeight: number;
  minHeight: number;
};

type AutosizeTextAreaProps = {
  maxHeight?: number;
  minHeight?: number;
  onSend?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const AutosizeTextarea = React.forwardRef<
  AutosizeTextAreaRef,
  AutosizeTextAreaProps
>(
  (
    {
      maxHeight = 300,
      minHeight = 52,
      className,
      onChange,
      value,
      onSend,
      ...props
    }: AutosizeTextAreaProps,
    ref: React.Ref<AutosizeTextAreaRef>,
  ) => {
    const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const triggerAutoSizeRef = React.useRef<string>("");

    const { resizeTextarea } = useAutosizeTextArea({
      textAreaRef,
      triggerAutoSize: triggerAutoSizeRef.current,
      maxHeight,
      minHeight,
      onSend,
      onChange,
    });

    useImperativeHandle(ref, () => ({
      textArea: textAreaRef.current as HTMLTextAreaElement,
      focus: () => textAreaRef.current?.focus(),
      maxHeight,
      minHeight,
    }));

    React.useEffect(() => {
      triggerAutoSizeRef.current = value as string;
      resizeTextarea();
    }, [value, resizeTextarea]);

    return (
      <textarea
        {...props}
        value={value}
        ref={textAreaRef}
        className={cn(
          "max-h-[300px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none",
          className,
        )}
        onChange={(e) => {
          onChange?.(e);
        }}
      />
    );
  },
);
AutosizeTextarea.displayName = "AutosizeTextarea";
