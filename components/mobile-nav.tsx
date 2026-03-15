"use client"

import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  SearchIcon,
  ClockIcon,
  BellIcon,
  MenuIcon,
  PartyPopperIcon,
  BookOpenIcon,
  CalculatorIcon,
  ClipboardCheckIcon,
  ScanLineIcon,
  MapIcon,
  UtensilsIcon,
  CarIcon,
  ContactIcon,
  NetworkIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

interface MobileNavProps {
  currentView: string
  onNavigate: (view: string) => void
}

export function MobileNav({ currentView, onNavigate }: MobileNavProps) {
  const mainNavItems = [
    { id: "dashboard", label: "Home", icon: HomeIcon },
    { id: "deadlines", label: "Deadlines", icon: CalendarIcon },
    { id: "scanner", label: "Scanner", icon: ScanLineIcon },
    { id: "notifications", label: "Alerts", icon: BellIcon, badge: 3 },
  ]

  const additionalNavItems = [
    { id: "skilltime", label: "SkillTime Hub", icon: UsersIcon },
    { id: "architecture", label: "Architecture", icon: NetworkIcon },
    { id: "forms", label: "Forms Portal", icon: FileTextIcon },
    { id: "lostfound", label: "Lost & Found", icon: SearchIcon },
    { id: "booking", label: "Queue Booking", icon: ClockIcon },
    { id: "events", label: "Campus Events", icon: PartyPopperIcon },
    { id: "studygroups", label: "Study Groups", icon: BookOpenIcon },
    { id: "gpa", label: "GPA Calculator", icon: CalculatorIcon },
    { id: "attendance", label: "Attendance Tracker", icon: ClipboardCheckIcon },
    { id: "notes", label: "Notes Sharing", icon: FileTextIcon },
    { id: "timer", label: "Study Timer", icon: ClockIcon },
    { id: "marketplace", label: "Marketplace", icon: HomeIcon },
    { id: "map", label: "Campus Map", icon: MapIcon },
    { id: "mealplan", label: "Meal Plan Tracker", icon: UtensilsIcon },
    { id: "rideshare", label: "Ride Sharing", icon: CarIcon },
    { id: "directory", label: "Campus Directory", icon: ContactIcon },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 safe-area-inset-bottom">
      <div className="grid grid-cols-5 h-16">
        {mainNavItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 h-full rounded-none relative ${
              currentView === item.id ? "text-primary bg-primary/10" : "text-muted-foreground"
            }`}
          >
            <item.icon className="size-5" />
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge && (
              <Badge className="absolute top-2 right-4 size-4 flex items-center justify-center p-0 text-[10px]">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center gap-1 h-full rounded-none text-muted-foreground"
            >
              <MenuIcon className="size-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl">
            <SheetHeader>
              <SheetTitle>More Features</SheetTitle>
            </SheetHeader>
            <div className="grid gap-2 py-4 max-h-[60vh] overflow-y-auto">
              {additionalNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "outline"}
                  onClick={() => onNavigate(item.id)}
                  className="justify-start gap-3 h-14"
                >
                  <item.icon className="size-5" />
                  <span className="text-base">{item.label}</span>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
