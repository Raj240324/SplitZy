import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Download, Upload, Trash2, Moon, Sun, Plus, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getGroups, saveGroups } from '@/utils/storage';
import { useTheme } from '@/components/theme-provider';

const currencies = [
  { value: 'INR', label: '₹ Indian Rupee (INR)', symbol: '₹' },
  { value: 'USD', label: '$ US Dollar (USD)', symbol: '$' },
  { value: 'EUR', label: '€ Euro (EUR)', symbol: '€' },
  { value: 'GBP', label: '£ British Pound (GBP)', symbol: '£' },
  { value: 'JPY', label: '¥ Japanese Yen (JPY)', symbol: '¥' },
  { value: 'AUD', label: 'A$ Australian Dollar (AUD)', symbol: 'A$' },
  { value: 'CAD', label: 'C$ Canadian Dollar (CAD)', symbol: 'C$' },
];

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // Load currency from localStorage
    const savedCurrency = localStorage.getItem('splitzy_currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    toast({
      title: 'Theme updated',
      description: `Switched to ${checked ? 'dark' : 'light'} mode`,
    });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    localStorage.setItem('splitzy_currency', value);
    toast({
      title: 'Currency updated',
      description: `Currency set to ${currencies.find(c => c.value === value)?.label}`,
    });
  };

  const handleExportData = () => {
    const groups = getGroups();
    const settings = {
      theme: theme === 'dark' ? 'dark' : 'light',
      currency
    };
    const exportData = { groups, settings, exportedAt: new Date().toISOString() };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `splitzy-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Data exported',
      description: 'Your data has been downloaded as a JSON file',
    });
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.groups) {
            saveGroups(data.groups);
          }
          if (data.settings) {
            if (data.settings.theme) {
              setTheme(data.settings.theme);
            }
            if (data.settings.currency) {
              handleCurrencyChange(data.settings.currency);
            }
          }
          toast({
            title: 'Data imported',
            description: 'Your data has been restored successfully',
          });
        } catch {
          toast({
            title: 'Import failed',
            description: 'Invalid file format. Please select a valid SplitZy backup file.',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const { user } = useUser();
  const location = useLocation();
  const isDemo = location.state?.demo === true;
  const userId = isDemo ? 'demo_guest' : user?.id;

  // ... (existing code for theme/currency)

  const handleClearData = () => {
    if (userId) {
      saveGroups([], userId);
      toast({
        title: 'Data cleared',
        description: 'All your groups and expenses have been deleted',
      });
      navigate('/dashboard', { state: { demo: isDemo } });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <Header />
      <div className="container mx-auto max-w-2xl px-4 space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how SplitZy looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes.
                </p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => {
                  setTheme(checked ? 'dark' : 'light');
                  toast({
                    title: 'Theme updated',
                    description: `Switched to ${checked ? 'dark' : 'light'} mode`,
                  });
                }} 
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Preferences
            </CardTitle>
            <CardDescription>
              Set your default currency and other app settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Default Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.symbol} {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
              Backup or clear your local application data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={handleExportData} className="gap-2">
                <Download className="w-4 h-4" />
                Backup Data
              </Button>
              <label className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" />
                Import Data
                <input type="file" className="hidden" accept=".json" onChange={handleImportData} />
              </label>
            </div>
            
            <div className="pt-4 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full gap-2">
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your groups, expenses, and settings from this device. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Clear Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <img src="/logo.png" alt="SplitZy" width="16" height="16" className="w-4 h-4" />
                <span className="font-bold text-foreground">SplitZy</span>
              </span>
              <span className="ml-2 text-[10px] opacity-50 font-mono">v1.2.0</span>
            </div>
            <p>A simple expense splitting app for groups</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
