import { useNavigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/clerk-react';
import { Users, Receipt, CheckCircle, Utensils, Plane, Home, PartyPopper, Shield, Zap, TrendingUp, Lock, Smartphone, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Header } from '@/components/Header';

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  const steps = [
    { icon: Users, title: 'Start a Vibe', desc: 'Add the squad, the roomies, or the travel besties.' },
    { icon: Receipt, title: 'Check the Receipts', desc: 'Log who paid for what — coffee, Ubers, concert tickets.' },
    { icon: CheckCircle, title: 'No Cap, No Debt', desc: 'See who owes what and settle up instantly. Zero awkwardness.' }
  ];

  const useCases = [
    { icon: Utensils, title: 'Main Characters', desc: 'Split the dinner bill without the drama' },
    { icon: Plane, title: 'Travel Eras', desc: 'Track your trip spent from flights to late night snacks' },
    { icon: Home, title: 'Roomie Rules', desc: 'Rent, groceries, and wifi. Clean and simple.' },
    { icon: PartyPopper, title: 'Core Memories', desc: 'Parties, gigs, and weekend hangs.' }
  ];

  const features = [
    { icon: Shield, title: 'Safe & Secure', desc: 'Bank-level lockup via Clerk. Your data is your business, period.' },
    { icon: Zap, title: 'Speedrun Mode', desc: 'Log expenses in seconds. Zero lag, all efficiency.' },
    { icon: TrendingUp, title: 'Big Brain Energy', desc: 'Visual charts that actually make sense. See where the money went.' },
    { icon: Smartphone, title: 'Offline Era', desc: 'Access your groups without Wifi. It just works, everywhere.' }
  ];

  const faqs = [
    {
      question: 'Is it actually free?',
      answer: "100% free. No hidden fees, no premium tiers, no ads. Just vibes and fair splitting."
    },
    {
      question: 'Is my data safe?',
      answer: "We use Clerk for secure logins. We're not in the business of selling data, only in the business of splitting bills."
    },
    {
      question: 'Can I use it without Wifi?',
      answer: "Yeah, it's a PWA. Install it on your home screen and it works offline like a total pro."
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
      <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950 text-white">
        <Header />
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-medium tracking-wide text-primary-foreground/80 uppercase">100% Free Forever</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 md:mb-8 tracking-tight leading-[1.1]">
                Less stress. <br /> 
                <span className="brand-text brand-glitch italic !font-black pb-2 block" data-text="More vibes.">
                  More vibes.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-8 md:mb-10 max-w-lg leading-relaxed">
                <span className="whitespace-nowrap">
                  <span className="font-bold text-white/90">Split</span><span className="brand-text brand-glitch !text-lg mx-0.5" data-text="Zy">Zy</span>
                </span> tracks the receipts so you can focus on the memories. Roomies, trips, or brunch — we got you, no cap.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {isSignedIn ? (
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto text-lg px-8 py-7 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all group"
                    onClick={() => navigate('/dashboard')}
                  >
                    Go to Dashboard
                    <ChevronDown className="w-5 h-5 ml-2 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    className="text-lg px-8 py-7 font-bold shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-all"
                    onClick={() => navigate('/sign-in')}
                  >
                    Start a Group
                  </Button>
                )}
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-lg px-8 py-7 font-bold bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More
                </Button>
              </div>

              {!isSignedIn && (
                <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold">
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
                  <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-bold text-xl">S</div>
                  <div className="h-6 w-24 bg-white/10 rounded-full animate-pulse" />
                </div>
                <div className="space-y-4">
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5">
                     <span className="text-xs font-semibold text-slate-300">Dinner at Main Town</span>
                     <span className="text-primary font-bold">₹2,400</span>
                  </div>
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5">
                     <span className="text-xs font-semibold text-slate-300">Coffee Squad</span>
                     <span className="text-primary font-bold">₹450</span>
                  </div>
                  <div className="h-10 w-full bg-white/5 rounded-xl flex items-center px-4 justify-between border border-white/5 opacity-50">
                     <span className="text-xs font-semibold text-slate-400">Uber Trip</span>
                     <span className="text-slate-400 font-bold">₹820</span>
                  </div>
                </div>
              </div>

              {/* Floating Mini Cards */}
              <div className="absolute top-[10%] right-[0%] p-4 bg-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-xl animate-float-delayed">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Settled Up</p>
                     <p className="text-xs font-semibold">You get ₹500</p>
                   </div>
                 </div>
              </div>

              <div className="absolute bottom-[10%] left-[0%] p-4 bg-primary/20 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-xl animate-float animation-delay-2000">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-xs">+</div>
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-wider text-primary">New Expense</p>
                     <p className="text-xs font-semibold">Trip Eras: ₹12,000</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section id="features" className="py-12 border-b border-border bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 text-center">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium uppercase tracking-wider">Secure Era</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium uppercase tracking-wider">Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium uppercase tracking-wider">No ads. No Cap.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Built for the modern world</h2>
          <p className="text-muted-foreground text-center mb-10 md:mb-12 max-w-sm md:max-w-md mx-auto">
            Powerful features that make expense splitting effortless
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-lg">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-10 md:mb-12 max-w-sm md:max-w-md mx-auto">
            Three simple steps to fair expense splitting
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="bg-card rounded-2xl p-8 text-center shadow-sm border border-border/50 hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-sm font-medium text-primary mb-2">Step {i + 1}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-4">Perfect for any situation</h2>
          <p className="text-muted-foreground text-center mb-10 md:mb-12 max-w-sm md:max-w-md mx-auto">
            Whether it's a trip, a party, or daily life.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {useCases.map((use, i) => (
              <div 
                key={i} 
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/5 transition-colors">
                  <use.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold mb-2">{use.title}</h3>
                <p className="text-muted-foreground text-sm">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
            Everything you need to know about SplitZy
          </p>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-card border border-border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-primary/5 border-y border-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Split without the drama.</h2>
          <p className="text-muted-foreground mb-8 md:mb-10 max-w-md md:max-w-xl mx-auto text-base md:text-lg">
            Join the squad and leave the awkward "who owes what" talk behind.
          </p>
          {isSignedIn ? (
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-lg px-8 py-6 font-semibold"
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </Button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 font-semibold"
              >
                Get Started Free
              </Button>
            </SignInButton>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="SplitZy" width="32" height="32" className="h-8 w-8 object-contain" />
              <div className="flex items-baseline gap-0.5">
                <span className="font-medium text-lg tracking-tighter text-foreground">
                  Split
                </span>
                <span className="brand-text brand-glitch text-2xl !italic !font-black" data-text="Zy">
                  Zy
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} SplitZy. Split bills, not friendships.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
