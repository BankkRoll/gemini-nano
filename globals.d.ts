// globals.d.ts
export type ChromeAISessionAvailable = "no" | "readily";

export interface ChromeAISessionOptions {
  temperature?: number;
  topK?: number;
}

export interface AITextSession {
  destroy: () => Promise<void>;
  prompt: (prompt: string) => Promise<string>;
  promptStreaming: (prompt: string) => ReadableStream<string>;
  execute: (prompt: string) => Promise<string>;
  executeStreaming: (prompt: string) => ReadableStream<string>;
}

export interface Window {
  ai?: {
    canCreateGenericSession: () => Promise<ChromeAISessionAvailable>;
    canCreateTextSession: () => Promise<ChromeAISessionAvailable>;
    defaultGenericSessionOptions: () => Promise<ChromeAISessionOptions>;
    defaultTextSessionOptions: () => Promise<ChromeAISessionOptions>;
    createGenericSession: (
      options?: ChromeAISessionOptions,
    ) => Promise<AITextSession>;
    createTextSession: (
      options?: ChromeAISessionOptions,
    ) => Promise<AITextSession>;
  };
}

declare global {
  var ai: Window["ai"];
  var model: typeof ai;
}
