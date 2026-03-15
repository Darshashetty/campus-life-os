"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { DeadlineManager } from "@/components/deadline-manager"
import { SkillTimeHub } from "@/components/skilltime-hub"
import { FormsPortal } from "@/components/forms-portal"
import { LostFound } from "@/components/lost-found"
import { QueueBooking } from "@/components/queue-booking"
import { HelpBot } from "@/components/helpbot"
import { NotificationCenter } from "@/components/notification-center"
import { MobileNav } from "@/components/mobile-nav"
import { EventsCalendar } from "@/components/events-calendar"
import { StudyGroups } from "@/components/study-groups"
import { GPACalculator } from "@/components/gpa-calculator"
import { AttendanceTracker } from "@/components/attendance-tracker"
import { NotesSharing } from "@/components/notes-sharing"
import { StudyTimer } from "@/components/study-timer"
import { CampusMarketplace } from "@/components/campus-marketplace"
import { QRScanner } from "@/components/qr-scanner"
import { AuthPage } from "@/components/auth-page"
import { CampusMap } from "@/components/campus-map"
import { MealPlanTracker } from "@/components/meal-plan-tracker"
import { RideSharing } from "@/components/ride-sharing"
import { CampusDirectory } from "@/components/campus-directory"
import { MicroservicesArchitecture } from "@/components/microservices-architecture"

export default function CampusLifeOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string } | null>(null)
  const [authToken, setAuthToken] = useState<string>("")
  const [currentView, setCurrentView] = useState<string>("dashboard")

  const handleNavigate = (view: string) => {
    setCurrentView(view)
  }

  const handleLogin = (email: string, name: string, token: string) => {
    setUser({ email, name })
    setAuthToken(token)
    setIsAuthenticated(true)
    setCurrentView("dashboard")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setAuthToken("")
    setCurrentView("dashboard")
  }

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentView={currentView} onNavigate={handleNavigate} user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6 max-w-7xl">
        {currentView === "dashboard" && <Dashboard onNavigate={handleNavigate} authToken={authToken} />}
        {currentView === "deadlines" && <DeadlineManager />}
        {currentView === "skilltime" && <SkillTimeHub />}
        {currentView === "forms" && <FormsPortal />}
        {currentView === "lostfound" && <LostFound />}
        {currentView === "booking" && <QueueBooking />}
        {currentView === "notifications" && <NotificationCenter />}
        {currentView === "events" && <EventsCalendar />}
        {currentView === "studygroups" && <StudyGroups />}
        {currentView === "gpa" && <GPACalculator />}
        {currentView === "attendance" && <AttendanceTracker />}
        {currentView === "notes" && <NotesSharing />}
        {currentView === "timer" && <StudyTimer />}
        {currentView === "marketplace" && <CampusMarketplace />}
        {currentView === "architecture" && <MicroservicesArchitecture />}
        {currentView === "scanner" && <QRScanner />}
        {currentView === "map" && <CampusMap />}
        {currentView === "mealplan" && <MealPlanTracker />}
        {currentView === "rideshare" && <RideSharing />}
        {currentView === "directory" && <CampusDirectory />}
      </main>
      <HelpBot />
      <MobileNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  )
}
