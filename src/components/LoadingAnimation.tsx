import { Logo } from "./Logo";

export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-8 animate-in fade-in duration-500">
      <div className="relative group">
        {/* Rapid Pulse Ring */}
        <div className="absolute inset-[-20px] bg-primary/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Rotating Glow Orbitals */}
        <div className="absolute inset-0 border-2 border-t-primary border-r-transparent border-b-fuchsia-500 border-l-transparent rounded-full animate-spin duration-[2s]" />
        <div className="absolute inset-[-10px] border border-l-cyan-400 border-t-transparent border-r-transparent border-b-transparent rounded-full animate-spin-slow opacity-50" />
        
        <div className="relative transform transition-transform group-hover:scale-110">
          <Logo size="lg" />
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
        <p className="text-[10px] font-black tracking-[0.3em] text-muted-foreground/60 uppercase animate-pulse">
          Syncing the vibez
        </p>
      </div>
    </div>
  );
};
