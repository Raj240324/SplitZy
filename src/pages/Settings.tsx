import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Header } from "@/components/Header";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Moon, Sun, Trash2, Info } from "lucide-react";
import { listenGroups, deleteGroup } from "@/services/group.service";
import { ManageUpi } from "@/components/profile/ManageUpi";

const currencies = [
  { value: "INR", label: "₹ Indian Rupee (INR)" },
  { value: "USD", label: "$ US Dollar (USD)" },
  { value: "EUR", label: "€ Euro (EUR)" },
  { value: "GBP", label: "£ British Pound (GBP)" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userId = user?.id;
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [currency, setCurrency] = useState("INR");
  const [clearing, setClearing] = useState(false);

  /* ---------------------------------------
     LOAD LOCAL UI PREFERENCES
  --------------------------------------- */
  useEffect(() => {
    const savedCurrency = localStorage.getItem("splitzy_currency");
    if (savedCurrency) setCurrency(savedCurrency);
  }, []);

  /* ---------------------------------------
     HANDLERS
  --------------------------------------- */
  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: "Theme updated",
      description: `Switched to ${checked ? "dark" : "light"} mode`,
    });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem("splitzy_currency", value);
    toast({
      title: "Currency updated",
      description: `Default currency set to ${value}`,
    });
  };

  const handleClearAllGroups = async () => {
    if (!userId) return;

    try {
      setClearing(true);

      const unsubscribe = listenGroups(userId, async (groups) => {
        for (const group of groups) {
          await deleteGroup(group.id);
        }
        unsubscribe();
      });

      toast({
        title: "Data cleared",
        description: "All your groups were deleted from the cloud",
      });

      navigate("/dashboard");
    } catch {
      toast({
        title: "Error",
        description: "Failed to clear your data",
        variant: "destructive",
      });
    } finally {
      setClearing(false);
    }
  };

  /* ---------------------------------------
     RENDER
  --------------------------------------- */
  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Header />

      <div className="container mx-auto max-w-2xl px-4 space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how SplitZy looks on your device.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle light or dark theme
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </CardContent>
        </Card>

        {/* UPI Management */}
        <ManageUpi />

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Default currency for calculations
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="w-5 h-5" />
              Data Management
            </CardTitle>
            <CardDescription>
              This will permanently delete your groups from the cloud.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={clearing}
                >
                  Clear All Groups
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your groups and expenses
                    from the cloud. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllGroups}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Everything
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              About SplitZy
            </CardTitle>
          </CardHeader>

          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p className="font-semibold text-foreground">SplitZy</p>
            <p>Smart expense splitting for groups</p>
            <p className="text-xs opacity-60">Version 1.0.0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
