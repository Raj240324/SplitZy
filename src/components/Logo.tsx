import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

export const Logo = ({ className, size = "md", showTagline = false }: LogoProps) => {
  const sizeClasses = {
    sm: {
      img: "h-6 w-6",
      split: "text-sm sm:text-base",
      zy: "text-lg sm:text-xl",
      container: "gap-1"
    },
    md: {
      img: "h-7 w-7 sm:h-8 sm:w-8",
      split: "text-sm sm:text-lg",
      zy: "text-lg sm:text-2xl",
      container: "gap-2"
    },
    lg: {
      img: "h-9 w-9 sm:h-10 sm:w-10",
      split: "text-lg sm:text-xl",
      zy: "text-2xl sm:text-3xl",
      container: "gap-2"
    },
    xl: {
      img: "h-10 w-10 sm:h-12 sm:w-12",
      split: "text-xl sm:text-2xl",
      zy: "text-3xl sm:text-4xl",
      container: "gap-3"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center", currentSize.container, className)}>
      <div className="relative group/logo">
        <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity" />
        <img 
          src="/Split-Zy.png" 
          alt="SplitZy Logo" 
          width="48" 
          height="48" 
          decoding="async"
          {...(size === 'lg' || size === 'xl' ? { fetchpriority: 'high' } : {})}
          className={cn(currentSize.img, "object-contain relative transition-transform group-hover/logo:rotate-12")} 
        />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2 whitespace-nowrap">
        <div className="flex items-baseline gap-0.5 font-medium tracking-tighter text-foreground">
          <span className={cn(currentSize.split)}>
            Split
          </span>
          <span 
            className={cn("brand-text brand-glitch !italic !font-black", currentSize.zy)} 
            data-text="Zy"
          >
            Zy
          </span>
        </div>
        {showTagline && (
          <>
            <div className="hidden lg:block h-4 w-[1px] bg-border/50 mx-1" />
            <span className="hidden lg:inline-block text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 uppercase">
              Split bills not friendships
            </span>
          </>
        )}
      </div>
    </div>
  );
};
