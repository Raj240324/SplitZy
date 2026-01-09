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
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using **SplitZy** ("the Application"), you agree to comply with and be bound by these Terms of Service. This application is developed and managed by **nagadev** (nagarajan.webdev@gmail.com). If you do not agree to these terms, please refrain from using the application.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
            <p>
              SplitZy is a tool designed to help users track shared expenses and simplify settlements within groups. While we aim for maximum precision, SplitZy is not a financial institution, and the calculations provided are for informational purposes only. Users should verify all balances before exchanging real currency.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. User Responsibilities</h2>
            <ol className="list-decimal pl-6 space-y-2 mt-4 text-muted-foreground">
              <li>You must provide accurate information when creating expenses.</li>
              <li><strong>Group Links:</strong> You are responsible for the security of your group invite links. Anyone with the link can view and join your group.</li>
              <li><strong>Real-time Sync:</strong> As SplitZy uses real-time synchronization, you acknowledge that multiple users may edit expenses simultaneously. Conflicts are handled based on the latest update.</li>
              <li>You agree not to use the Application for any fraudulent or illegal activities.</li>
            </ol>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. UPI Payments & External Links</h2>
            <p className="text-muted-foreground">
              SplitZy provides features to generate UPI payment links and QR codes to facilitate settlements. However:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
              <li>SplitZy is **not** a payment processor.</li>
              <li>Actual money transfers occur through third-party UPI applications (e.g., GPay, PhonePe, Paytm).</li>
              <li>We are not responsible for any failed transactions, incorrect transfers, or disputes between users.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              **nagadev** shall not be liable for any direct, indirect, or incidental damages resulting from the use or inability to use the service, including but not limited to financial losses or incorrect data representation.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">6. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of SplitZy following any changes constitutes your acceptance of the new Terms of Service.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Legal Inquiry</h2>
            <p className="text-sm text-muted-foreground">
              For any legal questions or support, please reach out to **nagadev** at:
              <br />
              <a href="mailto:nagarajan.webdev@gmail.com" className="text-primary font-bold decoration-none">nagarajan.webdev@gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
