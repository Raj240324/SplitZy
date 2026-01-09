import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon } from "lucide-react";
import { NavLink } from "./NavLink";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationBell } from "./NotificationBell";

export const Header = () => {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const lenis = (window as any).lenis;
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -80 });
    } else {
      window.location.href = `/#${id}`;
    }
  };

  return (
    <div className="fixed top-2 md:top-4 left-0 right-0 z-50 px-2 md:px-4 pointer-events-none">
      <header className="container mx-auto max-w-6xl h-14 bg-background/70 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-full flex items-center justify-between px-3 md:px-6 pointer-events-auto transition-all hover:border-primary/30 text-foreground">
        <NavLink to="/" className="flex items-center gap-2 group transition-transform active:scale-95">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img src="/Split-Zy.png" alt="SplitZy" width="32" height="32" className="h-8 w-8 object-contain relative transition-transform group-hover:rotate-12" />
          </div>
          <div className="flex items-baseline gap-0.5 group-hover:tracking-tight transition-all duration-500 whitespace-nowrap">
            <span className="font-medium text-sm sm:text-lg tracking-tighter text-foreground">
              Split
            </span>
            <span className="brand-text brand-glitch text-lg sm:text-2xl !italic !font-black" data-text="Zy">
              Zy
            </span>
          </div>
        </NavLink>

        <div className="flex items-center gap-1 sm:gap-4">
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-fluid-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full" asChild>
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}>How it Works</a>
            </Button>
            <Button variant="ghost" size="sm" className="text-fluid-xs font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full" asChild>
              <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')}>FAQ</a>
            </Button>
          </nav>
          
          <div className="h-6 w-[1px] bg-border/50 hidden md:block" />
          
          <div className="flex items-center gap-1 md:gap-2 focus:outline-none">
            <NotificationBell />
            <ModeToggle />
            <SignedOut>
              <Button size="sm" className="font-bold rounded-full px-5 shadow-sm active:scale-95 transition-transform" asChild>
                <NavLink to="/sign-in">
                  Join
                </NavLink>
              </Button>
            </SignedOut>
            <SignedIn>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors flex" asChild>
                <NavLink to="/settings">
                  <SettingsIcon className="w-4 h-4 sm:w-5 h-5" />
                </NavLink>
              </Button>
              <div className="flex items-center pl-1 border-l border-border/50 ml-0.5 sm:ml-1">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7 sm:w-8 h-8 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </header>
    </div>
  );
};
