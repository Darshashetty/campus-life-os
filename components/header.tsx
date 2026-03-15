"use client"

import { Button } from "@/components/ui/button"
import {
  MoonIcon,
  SunIcon,
  BellIcon,
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  PartyPopperIcon,
  BookOpenIcon,
  CalculatorIcon,
  ClipboardCheckIcon,
  LogOutIcon,
  UserIcon,
  MapIcon,
  UtensilsIcon,
  CarIcon,
  ContactIcon,
  NetworkIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MenuIcon } from "lucide-react"

interface HeaderProps {
  currentView: string
  onNavigate: (view: string) => void
  user?: { email: string; name: string } | null
  onLogout?: () => void
}

export function Header({ currentView, onNavigate, user, onLogout }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: HomeIcon },
    { id: "deadlines", label: "Deadlines", icon: CalendarIcon },
    { id: "architecture", label: "Architecture", icon: NetworkIcon },
    { id: "skilltime", label: "SkillTime Hub", icon: UsersIcon },
    { id: "forms", label: "Forms", icon: FileTextIcon },
    { id: "lostfound", label: "Lost & Found", icon: SearchIcon },
    { id: "booking", label: "Bookings", icon: ClockIcon },
  ]

  const moreNavItems = [
    { id: "events", label: "Campus Events", icon: PartyPopperIcon },
    { id: "studygroups", label: "Study Groups", icon: BookOpenIcon },
    { id: "gpa", label: "GPA Calculator", icon: CalculatorIcon },
    { id: "attendance", label: "Attendance Tracker", icon: ClipboardCheckIcon },
    { id: "notes", label: "Notes Sharing", icon: FileTextIcon },
    { id: "timer", label: "Study Timer", icon: ClockIcon },
    { id: "marketplace", label: "Campus Marketplace", icon: HomeIcon },
    { id: "map", label: "Campus Map", icon: MapIcon },
    { id: "mealplan", label: "Meal Plan Tracker", icon: UtensilsIcon },
    { id: "rideshare", label: "Ride Sharing", icon: CarIcon },
    { id: "directory", label: "Campus Directory", icon: ContactIcon },
  ]

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (view: string) => {
    onNavigate(view)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-14 md:h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 md:size-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm md:text-base">CL</span>
            </div>
            <span className="font-bold text-base md:text-lg">Campus Life OS</span>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavClick(item.id)}
                className="gap-2"
              >
                <item.icon className="size-4" />
                {item.label}
              </Button>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MenuIcon className="size-4" />
                  More
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Academic Tools</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {moreNavItems.map((item) => (
                  <DropdownMenuItem key={item.id} onClick={() => handleNavClick(item.id)}>
                    <item.icon className="size-4 mr-2" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden md:flex"
            onClick={() => handleNavClick("notifications")}
          >
            <BellIcon className="size-5" />
            <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-xs">3</Badge>
          </Button>

          <Button variant="ghost" size="icon" onClick={handleThemeToggle}>
            <SunIcon className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user && onLogout && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <UserIcon className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                  <LogOutIcon className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
