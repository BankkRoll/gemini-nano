import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpIcon,
  CaretDownIcon,
  CountdownTimerIcon,
  Cross2Icon,
  PinLeftIcon,
  PinRightIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

import ChromeVersionBadge from "../chat/badge";
import { Label } from "./label";
import { ModeToggle } from "./mode-toggle";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";
import { Switch } from "./switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import useUserStore from "@/hooks/use-user-store";

interface NavbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const {
    chatSessions,
    activeChat,
    addChatSession,
    deleteChatSession,
    clearChatSessions,
    setActiveChatSession,
    isStreaming,
    setStreaming,
  } = useUserStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | undefined>(undefined);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);

  const handleAccordionChange = (value: string | undefined) => {
    setExpanded(value);
  };

  const handleAddNewChat = () => {
    const newChat = addChatSession();
    toast.success(`Chat session ${newChat.id} created.`);
  };

  const handleClearAllChats = () => {
    clearChatSessions();
    toast.success(`${chatSessions.length} chat sessions cleared.`);
  };

  const handleDeleteChat = (id: string) => {
    deleteChatSession(id);
    toast.success(`Chat session ${id} deleted.`);
  };

  return (
    <>
      <div className="fixed left-0 right-0 z-30 flex items-center justify-between p-4 border-b shadow-lg -top-1 md:hidden bg-background rounded-b-xl">
        <div className="flex items-center">
          <Button
            variant="ringHoverOutline"
            size="icon"
            className="p-2 md:hidden"
            onClick={() => setIsSheetOpen(true)}
          >
            <PinRightIcon className="w-6 h-6" />
          </Button>
        </div>
        <ChromeVersionBadge />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="pt-20" side="left">
          <div className="flex flex-col gap-4">
            <SheetClose asChild>
              <Button
                variant="ringHoverOutline"
                className="justify-start w-full"
                onClick={handleAddNewChat}
              >
                <ArrowUpIcon className="w-6 h-6" />
                <span className="ml-2">New chat</span>
              </Button>
            </SheetClose>

            <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ringHoverOutline"
                  className="justify-start w-full"
                >
                  <Cross2Icon className="w-6 h-6" />
                  <span className="ml-2">Clear All Chats</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all your chat history.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="px-4 py-2 rounded-md bg-red-600 shadow-sm hover:bg-red-500">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllChats}
                    className="px-4 py-2 rounded-md bg-green-600 shadow-sm hover:bg-green-500"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Separator className="w-full mt-2" />
            <Accordion
              defaultValue="mobile-chat"
              type="single"
              collapsible
              value={expanded}
              onValueChange={handleAccordionChange}
            >
              <AccordionItem value="mobile-chat">
                <AccordionTrigger className="flex items-center gap-2 px-2">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key="mobile-chat-icon"
                      initial={{ opacity: 0, rotate: -180, scale: 0 }}
                      animate={{
                        opacity: 1,
                        rotate: expanded === "mobile-chat" ? 0 : -180,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, rotate: 90, scale: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="relative"
                    >
                      <CaretDownIcon className="w-6 h-6" />
                    </motion.div>
                  </AnimatePresence>
                  <h2 className="text-md font-semibold">Chat History</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea className="p-4 border rounded-md h-[30rem]">
                    {chatSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between w-full mb-1 ${
                          activeChat?.id === session.id
                            ? "bg-accent rounded-lg text-blue-600"
                            : ""
                        }`}
                      >
                        <Button
                          variant="linkHover2"
                          className="w-full p-0"
                          onClick={() => setActiveChatSession(session.id)}
                        >
                          {session.title ? session.title : index + 1}
                        </Button>
                        <AlertDialog
                          open={chatToDelete === session.id}
                          onOpenChange={(open) =>
                            setChatToDelete(open ? session.id : null)
                          }
                        >
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="hover:text-red-600 hover:bg-transparent"
                              aria-label="Delete chat"
                            >
                              <TrashIcon />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete this chat.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="px-4 py-2 rounded-md bg-red-600 shadow-sm hover:bg-red-500">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteChat(session.id)}
                                className="px-4 py-2 rounded-md bg-green-600 shadow-sm hover:bg-green-500"
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    ))}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="absolute left-0 right-0 flex flex-col items-center gap-4 p-4 bottom-4">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="streaming-toggle"
                className={`cursor-pointer text-sm text-center ${
                  isStreaming ? "text-primary/20" : "text-primary"
                }`}
                onClick={() => setStreaming(true)}
              >
                Await Response
              </Label>
              <Switch
                checked={isStreaming}
                onCheckedChange={(checked) => setStreaming(checked)}
                id="streaming-toggle"
              />
              <Label
                htmlFor="streaming-toggle"
                className={`cursor-pointer text-sm text-center ${
                  isStreaming ? "text-primary" : "text-primary/20"
                }`}
                onClick={() => setStreaming(false)}
              >
                Streaming Chunks
              </Label>
            </div>
            <div className="flex w-full">
              <ModeToggle showText={true} />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div
        className={`hidden md:flex overflow-x-hidden rounded-r-xl border-r fixed z-50 gap-4 shadow-lg top-0 left-0 bottom-0 bg-background transform transition-all duration-500 ease-in-out ${
          isSidebarOpen ? "translate-x-0 w-[220px]" : "w-[75px]"
        }`}
      >
        <div
          className={cn(
            "flex flex-col h-full overflow-x-hidden transform transition-all duration-500 ease-in-out",
            isSidebarOpen && "min-w-[200px]",
          )}
        >
          <div className="flex items-center justify-between p-4 overflow-x-hidden">
            <Button
              className={cn(
                buttonVariants({ variant: "ringHoverOutline" }),
                "p-5 text-primary flex items-center justify-center transition-all duration-500 ease-in-out",
              )}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <AnimatePresence initial={false} mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="cross"
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <PinLeftIcon className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="hamburger"
                    initial={{ opacity: 0, rotate: -90, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute"
                  >
                    <PinRightIcon className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          <div className="flex flex-col flex-1 gap-4 p-4 overflow-x-hidden overflow-y-auto">
            <Button
              className={cn(
                buttonVariants({ variant: "ringHoverOutline" }),
                "w-full justify-start p-2 text-primary gap-2 flex transition-all duration-500 ease-in-out",
              )}
              onClick={handleAddNewChat}
            >
              <ArrowUpIcon className="w-6 h-6" />
              {isSidebarOpen && <span className="ml-2">New chat</span>}
            </Button>

            <AlertDialog open={isClearAllOpen} onOpenChange={setIsClearAllOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className={cn(
                    buttonVariants({ variant: "ringHoverOutline" }),
                    "w-full p-2 text-primary gap-2 flex justify-start transition-all duration-500 ease-in-out",
                  )}
                >
                  <Cross2Icon className="w-6 h-6" />
                  {isSidebarOpen && (
                    <span className="ml-2">Clear All Chats</span>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    all of your chats.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="px-4 py-2 rounded-md bg-red-600 shadow-sm hover:bg-red-500">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllChats}
                    className="px-4 py-2 rounded-md bg-green-600 shadow-sm hover:bg-green-500"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Separator className="w-full mt-2" />
            <Accordion
              defaultValue="chat-history"
              type="single"
              collapsible
              value={expanded}
              onValueChange={handleAccordionChange}
            >
              <AccordionItem value="chat-history">
                <AccordionTrigger className="flex items-center gap-2 px-2">
                  <AnimatePresence initial={false} mode="wait">
                    <motion.div
                      key="chat-history-icon"
                      initial={{ opacity: 0, rotate: -180, scale: 0 }}
                      animate={{
                        opacity: 1,
                        rotate: expanded === "chat-history" ? 0 : -180,
                        scale: 1,
                      }}
                      exit={{ opacity: 0, rotate: 90, scale: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="relative"
                    >
                      <CaretDownIcon className="w-6 h-6" />
                    </motion.div>
                  </AnimatePresence>
                  {isSidebarOpen && (
                    <h2 className="text-md font-semibold">Chat History</h2>
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  <ScrollArea
                    className={cn(
                      "border rounded-lg h-[30rem] py-1",
                      isSidebarOpen && "px-2",
                    )}
                  >
                    {chatSessions.map((session, index) => (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between w-full mb-1 ${
                          activeChat?.id === session.id
                            ? "bg-accent rounded-lg text-blue-600"
                            : ""
                        }`}
                      >
                        <Button
                          variant="linkHover2"
                          className="w-full p-0"
                          onClick={() => setActiveChatSession(session.id)}
                        >
                          {isSidebarOpen ? session.title : index + 1}
                        </Button>
                        {isSidebarOpen && (
                          <AlertDialog
                            open={chatToDelete === session.id}
                            onOpenChange={(open) =>
                              setChatToDelete(open ? session.id : null)
                            }
                          >
                            <AlertDialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:text-red-600 hover:bg-transparent"
                                aria-label="Delete chat"
                              >
                                <TrashIcon />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will
                                  permanently delete this chat.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="px-4 py-2 rounded-md bg-red-600 shadow-sm hover:bg-red-500">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteChatSession(session.id);
                                    toast.success(
                                      `Chat session ${session.id} deleted.`,
                                    );
                                  }}
                                  className="px-4 py-2 rounded-md bg-green-600 shadow-sm hover:bg-green-500"
                                >
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    ))}
                  </ScrollArea>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex items-center gap-2 p-4">
            {isSidebarOpen && (
              <Label
                htmlFor="streaming-toggle"
                className={`cursor-pointer text-[10px] text-center ${
                  isStreaming ? "text-primary/20" : "text-primary"
                }`}
                onClick={() => setStreaming(true)}
              >
                Await Response
              </Label>
            )}
            <Switch
              checked={isStreaming}
              onCheckedChange={setStreaming}
              id="streaming-toggle"
            />
            {isSidebarOpen && (
              <Label
                htmlFor="streaming-toggle"
                className={`cursor-pointer text-[10px] text-center ${
                  isStreaming ? "text-primary" : "text-primary/20"
                }`}
                onClick={() => setStreaming(false)}
              >
                Streaming Chunks
              </Label>
            )}
          </div>
          <div className="flex items-center p-4">
            {isSidebarOpen ? <ModeToggle showText={true} /> : <ModeToggle />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
