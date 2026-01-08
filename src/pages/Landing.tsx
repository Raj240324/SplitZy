import { useNavigate } from 'react-router-dom';
import { Users, Receipt, CheckCircle, Utensils, Plane, Home, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: Users, title: 'Create a Group', desc: 'Add your friends, roommates, or travel buddies' },
    { icon: Receipt, title: 'Add Expenses', desc: 'Log who paid for what — meals, rides, tickets' },
    { icon: CheckCircle, title: 'Settle Up', desc: 'See who owes whom and settle with ease' }
  ];

  const useCases = [
    { icon: Utensils, title: 'Roommates', desc: 'Split rent, groceries, and utilities' },
    { icon: Plane, title: 'Travel', desc: 'Track group trip expenses easily' },
    { icon: Home, title: 'Households', desc: 'Manage shared home expenses' },
    { icon: PartyPopper, title: 'Events', desc: 'Split costs for parties and outings' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
              Split expenses.
              <span className="text-primary block mt-2">Stay friends.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 mb-10 max-w-xl mx-auto">
              The simplest way to split bills with friends, roommates, and groups. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 font-semibold"
                onClick={() => navigate('/dashboard')}
              >
                Start a Group Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 font-semibold border-zinc-600 text-zinc-200 hover:bg-zinc-800"
                onClick={() => navigate('/dashboard')}
              >
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
            Three simple steps to fair expense splitting
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, i) => (
              <div 
                key={i} 
                className="bg-card rounded-2xl p-8 text-center shadow-sm border border-border hover:shadow-md transition-shadow"
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
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Perfect for any situation</h2>
          <p className="text-muted-foreground text-center mb-12 max-w-md mx-auto">
            Whether it's a trip, a party, or daily life
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {useCases.map((use, i) => (
              <div 
                key={i} 
                className="bg-card rounded-xl p-6 border border-border hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <use.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{use.title}</h3>
                <p className="text-muted-foreground text-sm">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-semibold">Splitzy Lite</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Data saved locally in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
