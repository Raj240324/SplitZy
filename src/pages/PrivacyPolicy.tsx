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
          <p className="text-muted-foreground mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <p>
              Welcome to **SplitZy**. This Privacy Policy explains how we collect, use, and protect your information when you use our application. SplitZy is developed and maintained by **nagadev** (nagarajan.webdev@gmail.com).
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">2. Data We Collect</h2>
            <p>
              To provide a functional and synchronized expense-sharing experience, we collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
              <li><strong>Authentication Data:</strong> We use <strong>Clerk</strong> to manage identities. This includes your email address, name, and profile picture.</li>
              <li><strong>Expense & Group Data:</strong> Information you enter about groups, members, expenses, and settlements is stored securely in <strong>Google Firebase</strong>.</li>
              <li><strong>AI Receipt Scanning:</strong> When you use the "Scan Bill" feature, images are processed using OCR technology. We do not store your raw receipt images permanently on our servers; only the extracted text (amounts and items) is saved to your account.</li>
              <li><strong>Group Sharing:</strong> When you share a group code or link, it allows others to join your group. Be careful who you share these with, as anyone with the link can see the group's expenses.</li>
              <li><strong>Payment Information:</strong> We store your Virtual Payment Address (UPI ID) only if you choose to add it to your profile or a group to facilitate easier settlements. We do not store bank account or credit card details.</li>
              <li><strong>Usage Data:</strong> Basic information about how you interact with the app to help us improve performance and fix bugs.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">3. Third-Party Services</h2>
            <p className="text-muted-foreground">
              We use trusted third-party services to power SplitZy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-muted-foreground">
              <li><strong>Clerk:</strong> For secure authentication and user management.</li>
              <li><strong>Google Firebase:</strong> For real-time database storage and synchronization.</li>
              <li><strong>Google Fonts:</strong> For typography.</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">4. Data Retention and Deletion</h2>
            <p className="text-muted-foreground">
              Your data remains in our system as long as your account is active. You can use the <strong>"Clear All Groups"</strong> feature in the Settings page to permanently delete your data from our database.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">5. Security</h2>
            <p className="text-muted-foreground">
              We prioritize the security of your data. By leveraging enterprise-grade platforms like Firebase and Clerk, we ensure that your information is encrypted and protected against unauthorized access.
            </p>
          </section>

          <section className="bg-muted/30 p-6 rounded-2xl border border-border">
            <h2 className="text-xl font-bold mb-2">Contact Developer</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions or concerns about this Privacy Policy, please contact **nagadev** at:
              <br />
              <a href="mailto:nagarajan.webdev@gmail.com" className="text-primary font-bold decoration-none">nagarajan.webdev@gmail.com</a>
            </p>
          </section>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
