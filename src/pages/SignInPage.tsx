import { SignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start sm:justify-center bg-background p-4 pt-20 sm:pt-4 relative">
      <div className="fixed top-0 left-0 w-full p-4 z-50 bg-background/80 backdrop-blur-sm border-b border-border/10 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-none sm:p-0 sm:mb-8">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
          onClick={() => navigate("/")}
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>
      <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
