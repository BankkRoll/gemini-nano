import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { CalendarIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useChromeVersion } from "@/hooks/use-chrome-version";

interface ChromeVersionBadgeProps {
  size?: "default" | "large";
}

const ChromeVersionBadge: React.FC<ChromeVersionBadgeProps> = ({
  size = "default",
}) => {
  const [fullVersion, majorVersion] = useChromeVersion();
  const isSupported = majorVersion >= 127;

  const sizeClassNames =
    size === "large"
      ? {
          dot: "w-6 h-6",
          text: "text-xl font-bold",
          versionText: "text-sm",
          cardWidth: "w-96",
        }
      : {
          dot: "w-3 h-3",
          text: "text-sm font-bold",
          versionText: "text-xs",
          cardWidth: "w-64",
        };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex flex-col items-center space-y-1 cursor-pointer max-h-12">
          <div className="flex items-center space-x-2">
            <motion.div
              className={`relative ${sizeClassNames.dot} rounded-full ${
                isSupported ? "bg-green-500" : "bg-red-500"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={`absolute top-0 left-0 w-full h-full rounded-full ${
                  isSupported ? "bg-green-500" : "bg-red-500"
                }`}
                initial={{ scale: 1, opacity: 1 }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              />
            </motion.div>
            <span
              className={`${sizeClassNames.text} ${isSupported ? "text-green-500" : "text-red-500"}`}
            >
              {isSupported ? "Supported" : "Update Required"}
            </span>
          </div>
          <motion.span
            className={`${sizeClassNames.versionText} text-primary/80`}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Version: {fullVersion || "unknown"}
          </motion.span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className={`${sizeClassNames.cardWidth}`}>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between space-x-4">
            <Avatar>
              <AvatarImage src="/gemini-nano.png" />
              <AvatarFallback>GN</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Chrome Version Info</h4>
              <div className="flex items-center pt-2">
                <CalendarIcon className="w-4 h-4 mr-2 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  Version: {fullVersion || "unknown"}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Troubleshooting:</h4>
            <ul className="space-y-1 text-xs list-disc list-inside">
              <li>
                Requires Chrome 127 or later:{" "}
                <a
                  href="https://www.google.com/chrome/canary/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chrome Canary
                </a>
              </li>
              <li>
                Enable:{" "}
                <code className="px-1 rounded bg-accent">
                  chrome://flags/#prompt-api-for-gemini-nano
                </code>
              </li>
              <li>
                Enable:{" "}
                <code className="px-1 rounded bg-accent">
                  chrome://flags/#optimization-guide-on-device-model
                </code>
              </li>
              <li>
                Click &quot;Optimization Guide On Device Model&quot; in{" "}
                <code className="px-1 rounded bg-accent">
                  chrome://components/
                </code>
              </li>
              <li>Wait for the model to download.</li>
            </ul>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default ChromeVersionBadge;
