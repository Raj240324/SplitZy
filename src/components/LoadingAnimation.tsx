import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingAnimation = ({ size = "lg", className }: LoadingAnimationProps) => {
  const containerClasses = {
    sm: "min-h-[100px]",
    md: "min-h-[250px]",
    lg: "fixed inset-0 min-h-screen z-50 bg-background"
  };

  const logoSizes = {
    sm: "sm",
    md: "md",
    lg: "lg"
  } as const;

  return (
    <div className={cn("flex flex-col items-center justify-center w-full gap-8 animate-in fade-in duration-700", containerClasses[size], className)}>
      <div className="relative group">
        {/* Rapid Pulse Ring */}
        <div className="absolute inset-[-20px] bg-primary/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Modern Minimalist Spinner */}
        <div className="absolute inset-[-8px] border-[3px] border-primary/10 border-t-primary rounded-full animate-spin duration-700" />
        
        <div className="relative transform transition-transform group-hover:scale-110">
          <Logo size={logoSizes[size]} />
        </div>
      </div>
    </div>
  );
};
