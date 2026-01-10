import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, ChevronLeft } from "lucide-react";
import { NavLink } from "./NavLink";
import { ModeToggle } from "@/components/mode-toggle";
import { NotificationBell } from "./NotificationBell";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRootPage = ['/', '/dashboard'].includes(location.pathname);
  const isAuthPage = location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up');
  const showBackButton = !isRootPage && !isAuthPage;

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
        <div className="flex items-center gap-1 sm:gap-2">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)} 
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 -ml-1 sm:-ml-2 text-muted-foreground hover:text-foreground"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            </Button>
          )}
          <NavLink to="/" className="flex items-center group transition-transform active:scale-95">
            <Logo showTagline />
          </NavLink>
        </div>

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
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors flex" asChild aria-label="Settings">
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
