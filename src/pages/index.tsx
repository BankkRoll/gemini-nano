import { useEffect, useRef, useState } from "react";
import useUserStore, { ChatMessage } from "@/hooks/use-user-store";

import { AITextSession } from "../../globals";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { AutosizeTextarea } from "@/components/chat/auto-textarea";
import BentoGrid from "@/components/chat/bento-grid";
import { Button } from "@/components/ui/button";
import ChromeVersionBadge from "@/components/chat/badge";
import { Message } from "@/components/chat/message";
import generateErrorMessage from "@/components/chat/error-message";
import { toast } from "sonner";
import { useChromeVersion } from "@/hooks/use-chrome-version";

const Home: React.FC = () => {
  const {
    activeChat,
    updateChatHistory,
    isStreaming,
    addChatSession,
    chatSessions,
    setActiveChatSession,
  } = useUserStore();

  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiSession, setAiSession] = useState<AITextSession | null>(null);

  const [fullVersion, majorVersion] = useChromeVersion();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeChat]);

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const canCreate = await window?.ai?.canCreateTextSession();
        if (canCreate === "readily") {
          const session = await window?.ai?.createTextSession();
          setAiSession(session || null);
        } else {
          throw new Error("Unable to create AI session.");
        }
      } catch (error) {
        console.error("Failed to create AI session:", error);
      }
    };

    initializeSession();

    return () => {
      aiSession?.destroy();
    };
  }, [aiSession]);

  const readStream = async (stream: ReadableStream<string>) => {
    const reader = stream.getReader();
    let responseMessage = "";
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        responseMessage += value;
        if (activeChat) {
          updateChatHistory(activeChat.id, {
            message: responseMessage,
            fromUser: false,
            loading: true,
          });
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      toast.error("Error reading stream.");
    }
    return responseMessage;
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    let currentChatId = activeChat?.id;

    if (!currentChatId) {
      console.error("No active chat session. Creating a new one.");
      await addChatSession();
      await new Promise((resolve) => setTimeout(resolve, 100));

      const updatedChatSessions = useUserStore.getState().chatSessions;
      const latestChatSession =
        updatedChatSessions[updatedChatSessions.length - 1];
      if (latestChatSession) {
        setActiveChatSession(latestChatSession.id);
        currentChatId = latestChatSession.id;
      } else {
        console.error("Failed to create and set a new chat session.");
        return;
      }
    }

    setIsLoading(true);

    updateChatHistory(currentChatId, {
      message,
      fromUser: true,
      loading: false,
    });

    try {
      if (!aiSession) throw new Error("AI session is not initialized.");
      if (majorVersion && majorVersion < 127) {
        throw new Error("Chrome version 127 or higher is required.");
      }

      let responseMessage = "";

      if (isStreaming) {
        const responseStream = await aiSession.promptStreaming(message);
        responseMessage = await readStream(responseStream);
      } else {
        responseMessage = await aiSession.prompt(message);
      }

      updateChatHistory(currentChatId, {
        message: responseMessage,
        fromUser: false,
        loading: false,
      });
      setMessage("");
      toast.success("Message sent successfully.");
    } catch (error: any) {
      setMessage("");
      console.error("Error during AI session:", error);

      const errorMessage = generateErrorMessage({ error });

      updateChatHistory(currentChatId, {
        message: errorMessage,
        fromUser: false,
        loading: false,
      });
      toast.error("Error during AI session.");
    } finally {
      setMessage("");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen gap-4 pt-16 pb-2 mx-auto md:pt-0">
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col h-full gap-4">
          <h2>{activeChat?.title}</h2>
          {!activeChat || activeChat.history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <BentoGrid />
              <div className="hidden mt-20 md:flex">
                <ChromeVersionBadge size="large" />
              </div>
            </div>
          ) : (
            activeChat.history.map((msg, index) => (
              <Message
                key={index}
                message={msg.message}
                fromUser={msg.fromUser}
                loading={msg.loading}
              />
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="relative flex items-center w-full mx-4 md:max-w-3xl lg:max-w-5xl">
          <AutosizeTextarea
            maxLength={5000}
            className="flex-1 p-4 pr-12 text-sm text-white placeholder-gray-400 border-none bg-accent rounded-3xl"
            placeholder="Message Gemini Nano"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onSend={sendMessage}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            size="icon"
            variant="outline"
            className="absolute transform -translate-y-1/2 rounded-full right-2 top-1/2"
            disabled={!message.trim() || isLoading}
          >
            <ArrowUpIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <div className="flex justify-center px-4">
        <p className="text-xs text-center text-gray-500">
          <span>No affiliation or association with</span>
          <a
            href="https://deepmind.google/technologies/gemini/nano/"
            className="hover:underline text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Google,
          </a>
          <a
            href="https://gemini.com"
            className="hover:underline text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Gemini,
          </a>
          <a
            href="https://nano.org"
            className="hover:underline text-blue-500"
            target="_blank"
            rel="noopener noreferrer"
          >
            {" "}
            Nano,
          </a>
          <span> or any of its affiliates.</span>
        </p>
      </div>
    </div>
  );
};

export default Home;
