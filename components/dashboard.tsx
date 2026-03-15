"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { fetchDashboardSummaryViaGateway, fetchServicesHealthViaGateway, type ServicesHealthResponse } from "@/lib/api-gateway"
import { ServiceStatusPanel } from "@/components/service-status-panel"
import { NotificationsWidget } from "@/components/notifications-widget"
import {
  CalendarIcon,
  UsersIcon,
  FileTextIcon,
  ClockIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
} from "lucide-react"

interface DashboardProps {
  onNavigate: (view: string) => void
  authToken?: string
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const fallbackDeadlines = [
    { id: 1, title: "Data Structures Assignment", date: "2026-01-08", priority: "high" },
    { id: 2, title: "Physics Lab Report", date: "2026-01-10", priority: "medium" },
    { id: 3, title: "Semester Fee Payment", date: "2026-01-15", priority: "high" },
  ]

  const fallbackStats = [
    { label: "Pending Tasks", value: 8, color: "bg-chart-1" },
    { label: "Skills Shared", value: 5, color: "bg-chart-2" },
    { label: "Forms Submitted", value: 12, color: "bg-chart-3" },
  ]

  const [upcomingDeadlines, setUpcomingDeadlines] = useState(fallbackDeadlines)
  const [activityStats, setActivityStats] = useState(fallbackStats)
  const [reminders, setReminders] = useState<Array<{ id: number; message: string; priority: string }>>([])
  const [profile, setProfile] = useState<{ name: string; department: string; gpa: number } | null>(null)
  const [recentActivity, setRecentActivity] = useState<Array<{ action: string; time: string }>>([])
  const [servicesHealth, setServicesHealth] = useState<ServicesHealthResponse | null>(null)
  const [dataSource, setDataSource] = useState<"microservices" | "local">("local")

  const quickActions = [
    { id: "deadlines", label: "View Deadlines", icon: CalendarIcon, description: "Manage assignments & exams" },
    { id: "skilltime", label: "Find Peers", icon: UsersIcon, description: "Discover student skills" },
    { id: "forms", label: "Submit Forms", icon: FileTextIcon, description: "Portal & form helper" },
    { id: "booking", label: "Book Slot", icon: ClockIcon, description: "Office appointments" },
    { id: "architecture", label: "Architecture", icon: FileTextIcon, description: "View service diagram" },
  ]

  const handleNavigate = (view: string) => {
    onNavigate(view)
  }

  useEffect(() => {
    let isMounted = true

    const loadDashboardSummary = async () => {
      try {
        const [data, health] = await Promise.all([fetchDashboardSummaryViaGateway(), fetchServicesHealthViaGateway()])

        if (!isMounted) {
          return
        }

        if (Array.isArray(data.activityStats)) {
          setActivityStats(data.activityStats)
        }

        if (Array.isArray(data.upcomingDeadlines)) {
          setUpcomingDeadlines(data.upcomingDeadlines)
        }

        if (Array.isArray(data.reminders)) {
          setReminders(data.reminders)
        }

        if (data.profile) {
          setProfile({
            name: data.profile.name,
            department: data.profile.department,
            gpa: data.profile.gpa,
          })
        }

        if (Array.isArray(data.recentActivity)) {
          setRecentActivity(data.recentActivity)
        }

        setServicesHealth(health)

        setDataSource(data.source === "microservices" ? "microservices" : "local")
      } catch {
        if (isMounted) {
          setDataSource("local")
        }
      }
    }

    loadDashboardSummary()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-balance">Welcome back, Student!</h1>
          <Badge variant="outline">{dataSource === "microservices" ? "Live: Microservices" : "Local Fallback"}</Badge>
        </div>
        <p className="text-muted-foreground text-pretty">{"Here's what's happening with your campus life today"}</p>
      </div>

      <ServiceStatusPanel health={servicesHealth} />

      {/* Overload Alert */}
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="rounded-full bg-destructive/10 p-2">
            <AlertTriangleIcon className="size-5 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">High Activity Detected</h3>
            <p className="text-sm text-muted-foreground">
              {reminders[0]?.message || "You have 8 pending tasks this week. Consider prioritizing or seeking peer help."}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => handleNavigate("deadlines")}>
            View All
          </Button>
        </CardContent>
      </Card>

      {/* Activity Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {activityStats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <TrendingUpIcon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Progress value={stat.value * 10} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {profile && (
        <Card>
          <CardHeader>
            <CardTitle>Live Student Profile</CardTitle>
            <CardDescription>Loaded from the Student Service through the API Gateway</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Student</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">Department</p>
              <p className="font-semibold">{profile.department}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-sm text-muted-foreground">GPA</p>
              <p className="font-semibold">{profile.gpa}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>{"Don't miss these important dates"}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => handleNavigate("deadlines")}>
                View All
                <ArrowRightIcon className="ml-2 size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div
                key={deadline.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="size-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-sm">{deadline.title}</p>
                    <p className="text-xs text-muted-foreground">{deadline.date}</p>
                  </div>
                </div>
                <Badge variant={deadline.priority === "high" ? "destructive" : "secondary"}>{deadline.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key campus features</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className="h-auto flex-col items-start gap-2 p-4 hover:bg-primary hover:text-primary-foreground transition-colors bg-transparent"
                onClick={() => handleNavigate(action.id)}
              >
                <action.icon className="size-5" />
                <div className="text-left">
                  <div className="font-semibold text-sm">{action.label}</div>
                  <div className="text-xs opacity-80">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        <NotificationsWidget reminders={reminders} onNavigate={handleNavigate} />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest campus interactions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {(recentActivity.length > 0
            ? recentActivity.map((activity, i) => ({
                ...activity,
                icon: i % 3 === 0 ? FileTextIcon : i % 3 === 1 ? UsersIcon : CheckCircle2Icon,
              }))
            : [
                { action: "Submitted Library Access Form", time: "2 hours ago", icon: FileTextIcon },
                { action: "Registered skill: Python Programming", time: "Yesterday", icon: UsersIcon },
                { action: "Completed Database Assignment", time: "2 days ago", icon: CheckCircle2Icon },
              ]).map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-2">
              <div className="rounded-full bg-muted p-2">
                <activity.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
