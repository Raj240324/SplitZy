import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
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
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 9, 2026</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Data We Collect</h2>
            <p>
              At **SplitZy**, we value your privacy. We collect only the information necessary to provide a seamless expense-sharing experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
              <li><strong>Account Information:</strong> We use Clerk for authentication. This includes your name, email address, and profile picture.</li>
              <li><strong>Financial Data:</strong> Expense titles, amounts, and settlement history stored in Google Firebase.</li>
              <li><strong>Group Details:</strong> Group names, member lists, and activity logs.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Data</h2>
            <p className="text-muted-foreground">
              Your data is used strictly for:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
              <li>Syncing expenses across your devices in real-time.</li>
              <li>Calculating balances and debt simplification.</li>
              <li>Processing receipt images via OCR (processed locally on your device).</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Data Security</h2>
            <p className="text-muted-foreground">
              We leverage enterprise-grade security via <strong>Clerk</strong> and <strong>Firebase</strong>. We do not sell your personal information or financial data to third parties.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Your Control</h2>
            <p className="text-muted-foreground">
              You have full control over your data. You can use the "Clear All Data" feature in the Settings page to permanently remove all your groups and expenses from our cloud storage.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Contact</h2>
            <p className="text-sm text-muted-foreground">
              For any questions regarding your privacy, contact us at support@splitzy.app
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
