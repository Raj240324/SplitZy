import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Download, Upload, Trash2, Moon, Sun } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getGroups, saveGroups } from '@/utils/storage';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    // Load settings from localStorage
    const savedTheme = localStorage.getItem('splitzy_theme');
    const savedCurrency = localStorage.getItem('splitzy_currency');
    
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('splitzy_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('splitzy_theme', 'light');
    }
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
      theme: isDarkMode ? 'dark' : 'light',
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
              handleThemeChange(data.settings.theme === 'dark');
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
            description: 'Invalid file format. Please select a valid Splitzy backup file.',
            variant: 'destructive',
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleClearData = () => {
    localStorage.removeItem('splitzy_groups');
    toast({
      title: 'Data cleared',
      description: 'All your groups and expenses have been deleted',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Appearance
            </CardTitle>
            <CardDescription>Customize how Splitzy looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Toggle dark theme</p>
              </div>
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Currency */}
        <Card>
          <CardHeader>
            <CardTitle>Currency</CardTitle>
            <CardDescription>Set your preferred currency for expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map(curr => (
                  <SelectItem key={curr.value} value={curr.value}>
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Export, import, or clear your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={handleExportData} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" onClick={handleImportData} className="flex-1">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-destructive">Danger Zone</h4>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your groups and expenses.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearData}>
                      Yes, clear all data
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
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p><strong>Splitzy Lite</strong> v1.0.0</p>
            <p>A simple expense splitting app for groups</p>
            <p className="pt-2">Made with ❤️ using Lovable</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Settings;
