import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { Users, Receipt, CheckCircle, Utensils, Plane, Home, PartyPopper, Shield, Zap, TrendingUp, Lock, Smartphone, ChevronDown, ScanLine, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/Header';
import { NavLink } from '@/components/NavLink';
import { Logo } from '@/components/Logo';

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const steps = [
    { icon: Users, title: 'Start a Vibe', desc: 'Add the squad, the roomies, or the travel besties.' },
    { icon: ScanLine, title: 'Scan & Go', desc: 'Snap a pic of the receipt. Our AI handles the math instantly.' },
    { icon: CheckCircle, title: 'No Cap, No Debt', desc: 'See who owes what and settle up instantly. Zero awkwardness.' }
  ];

  const useCases = [
    { icon: Utensils, title: 'Main Characters', desc: 'Split the dinner bill without the drama' },
    { icon: Plane, title: 'Travel Eras', desc: 'Track your trip spent from flights to late night snacks' },
    { icon: Home, title: 'Roomie Rules', desc: 'Rent, groceries, and wifi. Clean and simple.' },
    { icon: PartyPopper, title: 'Core Memories', desc: 'Parties, gigs, and weekend hangs.' }
  ];

  const features = [
    { icon: ScanLine, title: 'AI Bill Scanning', desc: 'Snap a pic and let OCR extract the total. No more manual entry.' },
    { icon: Zap, title: 'Real-time Sync', desc: 'Powered by Firebase. Your data syncs instantly across every device.' },
    { icon: TrendingUp, title: 'Visual Analytics', desc: 'Smart charts that show exactly where the money goes.' },
    { icon: Printer, title: 'Print & Export', desc: 'Export beautiful CSV reports or print professional group summaries.' }
  ];

  const faqs = [
    {
      question: 'Is it actually free?',
      answer: "100% free. No hidden fees, no premium tiers, no ads. Just vibes and fair splitting."
    },
    {
      question: 'Is my data safe?',
      answer: "We use Clerk for authentication and Google Firebase for secure cloud storage. Your data is encrypted and private — we never sell it."
    },
    {
      question: 'Can I use it on multiple devices?',
      answer: "Absolutely. Log in from any phone or laptop and find your groups perfectly synced in real-time."
    },
    {
      question: 'How do I "Settle Up"?',
      answer: "Our smart algorithm does the math so you don't have to. It shows the fewest payments to get everyone to zero."
    },
    {
      question: 'Can my friends join?',
      answer: "Drop them a share code. They join, you split, everyone wins."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] md:min-h-screen flex items-center overflow-hidden bg-slate-950 text-white transition-colors duration-500 selection:bg-primary/30">
        <Header />
        {/* Animated Background Blobs - Optimized with will-change and reduced blur and transparency */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/15 rounded-full blur-[100px] animate-blob will-change-transform" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000 will-change-transform" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/5 rounded-full blur-[80px] animate-blob animation-delay-4000 will-change-transform" />
        </div>

        <div className="container mx-auto px-6 md:px-12 py-12 md:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in">
                <span className="text-[10px] font-black tracking-[0.25em] text-primary uppercase">100% Free Forever</span>
              </div>
              
              <h1 className="text-fluid-hero font-black mb-6 md:mb-8 tracking-[-0.04em] text-white">
                Less stress. <br /> 
                <span className="brand-text brand-glitch italic pb-2 block" data-text="More vibes.">
                  More vibes.
                </span>
              </h1>
              
              <p className="text-fluid-body-lg text-slate-400 mb-10 md:mb-12 max-w-lg leading-relaxed font-light tracking-tight">
                <span className="whitespace-nowrap">
                  <span className="font-bold text-white/90">Split</span>                  <span className="brand-text brand-glitch !text-fluid-lg mx-0.5" data-text="Zy">Zy</span>
                </span> uses AI and Firebase to scan receipts and sync expenses in real-time. Roomies, trips, or brunch — we got you, no cap.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center">
                {isSignedIn ? (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-7 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all group active:scale-95"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                    <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-7 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all active:scale-95"
                    onClick={() => navigate('/sign-in')}
                  >
                    Start a Group
                  </Button>
                )}
              </div>

              {!isSignedIn && (
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-fluid-xs font-black text-slate-400 shadow-sm">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <span>Join 500+ squads today</span>
                </div>
              )}
            </div>

            {/* Floating Visual Elements */}
            <div className="relative hidden lg:block h-[500px]">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-8 animate-float">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">S</div>
                  <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5">
                     <span className="text-fluid-sm font-semibold text-slate-300">Dinner at Main Town</span>
                     <span className="text-primary font-bold">₹2,400</span>
                  </div>
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5">
                     <span className="text-fluid-sm font-semibold text-slate-300">Coffee Squad</span>
                     <span className="text-primary font-bold">₹450</span>
                  </div>
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5 opacity-50">
                     <span className="text-fluid-sm font-semibold text-slate-400">Uber Trip</span>
                     <span className="text-slate-400 font-bold">₹820</span>
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <div className="absolute top-[10%] right-[0%] p-4 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-xl animate-float-delayed">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"><CheckCircle className="w-4 h-4" /></div>
                   <div>
                      <p className="text-fluid-xs font-bold uppercase tracking-wider text-emerald-400">Settled Up</p>
                      <p className="text-fluid-sm font-semibold text-white">You get ₹500</p>
                   </div>
                 </div>
              </div>

              <div className="absolute bottom-[10%] left-[0%] p-4 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-xl animate-float animation-delay-2000">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-black text-white text-fluid-xs shadow-lg shadow-primary/20">+</div>
                   <div>
                      <p className="text-fluid-xs font-bold uppercase tracking-wider text-primary">New Expense</p>
                      <p className="text-fluid-sm font-semibold text-white">Trip Eras: ₹12,000</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section id="features" className="py-8 md:py-12 border-b border-border bg-muted/30 dark:bg-slate-900/50 backdrop-blur-sm transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center">
            <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground md:text-foreground/70 transition-colors">Secure Era</span>
            </div>
            <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Shield className="w-5 h-5 text-emerald-500" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground md:text-foreground/70 transition-colors">Free Forever</span>
            </div>
            <div className="flex items-center gap-3 group px-4 py-2 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground md:text-foreground/70 transition-colors">No ads. No Cap.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-32 bg-background dark:bg-slate-950 relative overflow-hidden transition-colors">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-fluid-heading font-black text-center mb-4 md:mb-6 tracking-[-0.03em] text-foreground transition-colors">
            Built for the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-violet-400 to-fuchsia-400 animate-shimmer">modern world</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 md:mb-20 max-w-md mx-auto text-fluid-lg leading-relaxed font-light tracking-tight transition-colors">
            Powerful features that make expense splitting effortless.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="bg-card dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 border border-border/50 dark:border-white/5 hover:border-primary/50 transition-all hover:shadow-[0_20px_50px_rgba(var(--primary),0.05)] group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold mb-3 text-xl text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground/70 transition-colors">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-32 bg-muted/20 dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 relative transition-colors">
        <div className="container mx-auto px-4">
          <h2 className="text-fluid-heading font-black text-center mb-4 md:mb-6 tracking-[-0.03em] text-foreground transition-colors">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 md:mb-20 max-w-md mx-auto text-fluid-lg font-light tracking-tight transition-colors">
            Three simple steps to fair expense splitting
          </p>
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="relative bg-card dark:bg-slate-800/30 backdrop-blur-sm rounded-3xl p-10 text-center border border-border/50 dark:border-white/5 hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-all group shadow-sm"
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
                  {i + 1}
                </div>
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform shadow-inner">
                  <step.icon className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-foreground uppercase tracking-tight transition-colors">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium transition-colors">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 md:py-24 bg-background dark:bg-slate-900 overflow-hidden relative transition-colors">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-fluid-subheading md:text-fluid-heading font-black text-center mb-3 md:mb-4 tracking-[-0.02em] text-foreground transition-colors">
            Perfect for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500 transition-colors">any situation</span>
          </h2>
          <p className="text-muted-foreground text-center mb-10 md:mb-16 max-w-md mx-auto text-fluid-body-lg leading-relaxed transition-colors">
            Whether it's a trip, a party, or daily life.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {useCases.map((use, i) => (
              <div 
                key={i} 
                className="bg-card dark:bg-slate-800/20 backdrop-blur-md rounded-2xl p-8 border border-border/50 dark:border-white/5 hover:border-blue-500/30 transition-all group flex flex-col items-center text-center shadow-sm"
              >
                <div className="w-16 h-16 bg-muted dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/10 transition-all group-hover:shadow-lg">
                  <use.icon className="w-8 h-8 text-muted-foreground dark:text-slate-400 group-hover:text-blue-500 group-hover:scale-110 transition-all" />
                </div>
                <h3 className="font-black mb-3 text-lg text-foreground group-hover:text-blue-500 transition-colors uppercase tracking-tight">{use.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium transition-colors">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-24 bg-muted/10 dark:bg-slate-950 transition-colors">
        <div className="container mx-auto px-4">
          <h2 className="text-fluid-subheading md:text-fluid-heading font-black text-center mb-3 md:mb-4 tracking-[-0.02em] text-foreground transition-colors">FAQ</h2>
          <p className="text-muted-foreground text-center mb-10 md:mb-16 max-w-md mx-auto text-fluid-body-lg leading-relaxed transition-colors">
            Everything you need to know about SplitZy
          </p>
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card dark:bg-slate-900/50 backdrop-blur-sm border border-border/50 dark:border-white/5 rounded-3xl px-8 md:px-10 overflow-hidden hover:border-primary/30 transition-all shadow-sm">
                  <AccordionTrigger className="text-left font-black text-lg md:text-xl hover:no-underline py-6 text-foreground group transition-colors">
                    <span className="group-hover:text-primary transition-colors">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base md:text-lg pb-8 leading-relaxed font-medium transition-colors">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-24 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-fluid-subheading md:text-fluid-heading font-bold mb-4 md:mb-6">Split without the drama.</h2>
          <p className="text-muted-foreground mb-8 md:mb-10 max-w-md md:max-w-xl mx-auto text-fluid-body-lg">
            Join the squad and leave the awkward "who owes what" talk behind.
          </p>
          {isSignedIn ? (
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 font-semibold shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              onClick={() => navigate('/sign-in')}
            >
              Get Started Free
            </Button>
          )}
        </div>
      </section>

      {/* Footer - Redesigned for Engagement & Stability */}
      <footer className="relative border-t border-primary/10 bg-muted/20 pb-12 pt-16 overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
              <Logo size="lg" />
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                The most aesthetic and efficient way to split bills, track expenses, and stay cool with the squad. No Cap, just vibes.
              </p>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <span className="text-xs font-black uppercase tracking-tighter">iOS</span>
                </div>
                <div className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer">
                  <span className="text-xs font-black uppercase tracking-tighter">Android</span>
                </div>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Product</h4>
              <nav className="flex flex-col gap-4">
                <a href="#features" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Features</a>
                <a href="#how-it-works" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">How it Works</a>
                <a href="#faq" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">FAQ</a>
                <NavLink to="/dashboard" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">Dashboard</NavLink>
              </nav>
            </div>

            {/* Engineering & Social Column */}
            <div className="space-y-6 text-center md:text-left">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/50">Engineering</h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">Developed by nagadev</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">+1000 Aura for the Group Chat</p>
                </div>
                <nav className="flex flex-col gap-4">
                  <a href="mailto:nagarajan.webdev@gmail.com" className="text-sm font-semibold text-primary hover:underline underline-offset-4 decoration-primary/30">
                    Contact Developer
                  </a>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <NavLink to="/privacy" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Privacy</NavLink>
                    <NavLink to="/terms" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-colors">Terms</NavLink>
                  </div>
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-muted-foreground/60 font-black tracking-[0.2em] uppercase text-center md:text-left">
              © {new Date().getFullYear()} SplitZy • Engineered with ❤️ for the main characters
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-black tracking-widest text-emerald-500/80 uppercase">System Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
