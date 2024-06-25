// src/components/chat/message.tsx

import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatMessage } from "@/hooks/use-user-store";

export const Message: React.FC<ChatMessage> = ({
  message,
  fromUser,
  loading,
}) => {
  return (
    <div
      className={`max-w-5xl mx-auto flex items-start w-full gap-2 ${
        fromUser ? "justify-end" : "justify-start"
      }`}
    >
      {!fromUser && (
        <Avatar className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full">
          AI
        </Avatar>
      )}
      <div className="flex flex-col w-full">
        <div
          className={`flex ${
            fromUser ? "justify-end" : "justify-start"
          } w-full`}
        >
          <div
            className={`px-4 py-2 rounded-lg w-full max-w-3xl ${
              fromUser ? "bg-accent" : "bg-accent/50"
            } break-words`}
          >
            {loading ? (
              <Skeleton className="w-full h-12 rounded-md" />
            ) : (
              <div
                className="w-full prose break-words"
                dangerouslySetInnerHTML={{ __html: message || "" }}
              />
            )}
          </div>
        </div>
      </div>
      {fromUser && (
        <Avatar className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
          U
        </Avatar>
      )}
    </div>
  );
};
