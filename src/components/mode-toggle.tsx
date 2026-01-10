import { Moon, Sun, Settings as SettingsIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useTheme } from "@/components/theme-provider"
import { useIsMobile } from "@/hooks/use-mobile"

export function ModeToggle() {
  const { setTheme } = useTheme()
  const isMobile = useIsMobile()

  const ToggleIcon = () => (
    <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors relative" aria-label="Toggle color theme">
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )

  const ThemeOptions = () => (
    <div className="flex flex-col gap-1 p-2">
      <div className="p-3 mb-2 border-b border-border/50">
        <p className="text-fluid-xs font-black uppercase tracking-widest text-muted-foreground">Appearance</p>
      </div>
      <Button 
        variant="ghost" 
        className="justify-start gap-3 h-12 rounded-2xl font-bold"
        onClick={() => setTheme("light")}
      >
        <Sun className="w-4 h-4" /> Light
      </Button>
      <Button 
        variant="ghost" 
        className="justify-start gap-3 h-12 rounded-2xl font-bold"
        onClick={() => setTheme("dark")}
      >
        <Moon className="w-4 h-4" /> Dark
      </Button>
      <Button 
        variant="ghost" 
        className="justify-start gap-3 h-12 rounded-2xl font-bold"
        onClick={() => setTheme("system")}
      >
        <SettingsIcon className="w-4 h-4 opacity-50" /> System
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div><ToggleIcon /></div>
        </DialogTrigger>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm p-2 overflow-hidden rounded-[2.5rem] border-border bg-background/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Appearance Settings</DialogTitle>
            <DialogDescription>
              Choose between light, dark, or system theme modes.
            </DialogDescription>
          </DialogHeader>
          <ThemeOptions />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <div><ToggleIcon /></div>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[120px] bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl"
      >
        <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2 font-medium cursor-pointer">
          <Sun className="w-3.5 h-3.5" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2 font-medium cursor-pointer">
          <Moon className="w-3.5 h-3.5" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2 font-medium cursor-pointer">
          <SettingsIcon className="w-3.5 h-3.5 opacity-50" /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
