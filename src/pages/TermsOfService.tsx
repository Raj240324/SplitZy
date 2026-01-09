import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-20">
      <Header />
      <div className="container mx-auto max-w-3xl px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 gap-2 hover:bg-primary/5 text-muted-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 9, 2026</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using SplitZy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              SplitZy is a tool designed to help users track shared expenses. While we strive for absolute accuracy in calculations, we are not a financial institution and the results should be verified before making actual payments.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibility</h2>
            <p className="text-muted-foreground">
              You are responsible for the data you enter into the application. SplitZy is not liable for any incorrect calculations resulting from user error or data entry mistakes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              SplitZy is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, or consequential damages arising from your use of the service.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Modifications</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify or terminate the service at any time without notice. We may also update these terms, and your continued use of the app constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Notice</h2>
            <p className="text-sm text-muted-foreground">
              SplitZy is built for fair splitting. Don't be that friend who disputes every cent. Be chill.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
