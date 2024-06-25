// src/components/chat/bento-grid.tsx
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

const cardData = [
  {
    name: "Gemini Nano",
    description: "Google Pixel's AI technology",
    href: "https://deepmind.google/technologies/gemini/nano/",
    cta: "Learn More",
    Icon: ArrowRightIcon,
    background: (
      <div className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500" />
    ),
  },
  {
    name: "DeepMind",
    description: "DeepMind's Gemini Nano technology",
    href: "https://deepmind.google/",
    cta: "Discover",
    Icon: ArrowRightIcon,
    background: (
      <div className="h-full bg-gradient-to-r from-blue-400 via-teal-500 to-green-500" />
    ),
  },
  {
    name: "GitHub",
    description:
      "GitHub repository for this template to interact with Gemini Nano",
    href: "https://github.com/BankkRoll/gemini-nano",
    cta: "Find on GitHub",
    Icon: ArrowRightIcon,
    background: (
      <div className="h-full bg-gradient-to-r from-gray-400 via-gray-500 to-black" />
    ),
  },
];

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const gridClasses = cn(
    "grid w-full max-w-3xl gap-2 md:gap-6",
    {
      "grid-cols-2": isMediumScreen && !isLargeScreen,
      "grid-cols-3": isLargeScreen,
    },
    className,
  );

  return (
    <motion.div
      className={gridClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  isMediumScreen,
  isLargeScreen,
}: {
  name: string;
  className?: string;
  background: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
  isMediumScreen: boolean;
  isLargeScreen: boolean;
}) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className={cn("group relative col-span-1", className, {
      "col-span-2": isMediumScreen && !isLargeScreen,
      "col-span-1": isLargeScreen,
    })}
  >
    <Card className="relative flex flex-col justify-between overflow-hidden min-h-32 md:min-h-48">
      <CardHeader />
      <CardContent className="transition-transform duration-300 group-hover:-translate-y-10">
        <Icon className="w-6 h-6 transition-transform duration-300 ease-in-out md:w-12 md:h-12 group-hover:scale-75" />
        <CardTitle className="text-lg font-semibold md:text-xl text-neutral-700 dark:text-neutral-300">
          {name}
        </CardTitle>
        <CardDescription className="text-xs md:text-md">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="absolute bottom-0 w-full p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <Button variant="ghost" asChild size="sm">
          <a href={href} target="_blank" rel="noopener noreferrer">
            {cta}
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </a>
        </Button>
      </CardFooter>
      <div className="absolute inset-0 transition-all duration-300 pointer-events-none group-hover:bg-accent-foreground/10" />
    </Card>
  </motion.div>
);

const BentoGridContainer: React.FC = () => {
  const isMediumScreen = useMediaQuery("(min-width: 768px)");
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 mx-auto">
      <img src="/gemini-nano.png" className="w-12 h-12" />
      <BentoGrid>
        {cardData.map((card, index) => (
          <BentoCard
            key={index}
            name={card.name}
            className={index === 2 ? "col-span-2 lg:col-span-1" : ""}
            background={card.background}
            Icon={card.Icon}
            description={card.description}
            href={card.href}
            cta={card.cta}
            isMediumScreen={isMediumScreen}
            isLargeScreen={isLargeScreen}
          />
        ))}
      </BentoGrid>
    </div>
  );
};

export default BentoGridContainer;
export { BentoGrid };
