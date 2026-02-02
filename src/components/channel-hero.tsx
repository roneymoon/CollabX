import { format } from "date-fns";

interface ChannelHeroProps {
  name: string;
  creationTime: number;
}

export const ChannelHero = ({ name, creationTime }: ChannelHeroProps) => {
  return (
    <div className="mx-8 mt-12 mb-8 animate-fadeIn max-w-[800px]">
      <div className="flex flex-col gap-6">
        <div className="size-12 rounded-xl bg-[#f3e8ff] dark:bg-purple-900/20 flex items-center justify-center text-[#9333ea] premium-lift cursor-default shadow-sm border border-purple-100/50">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"
            />
          </svg>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-[44px] font-serif font-bold tracking-tight text-[#111827] dark:text-white leading-[1.1]">
            Welcome to the heart of <br />
            <span className="text-primary italic font-medium">#{name}</span>
          </h1>

          <p className="text-[15px] text-muted-foreground/60 leading-relaxed max-w-[560px] font-sans">
            This channel was created on{" "}
            <span className="text-foreground/80 font-semibold">
              {format(new Date(creationTime), "MMMM d, yyyy")}
            </span>
            . A dedicated space for discussions, announcements, and shared updates.
          </p>
        </div>
      </div>
    </div>
  );
};
