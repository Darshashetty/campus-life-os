

export const registerStudentServiceController = (app) => {
// ─── In-memory student store ──────────────────────────────────────────────────
let profile = {
  id: 1,
  name: "Demo Student",
  email: "demo@university.edu",
  level: "Undergraduate",
  department: "Computer Science",
  gpa: 3.7,
  enrolledCourses: ["Data Structures", "Algorithms", "Physics", "Discrete Math"],
}

let stats = [
  { label: "Pending Tasks",   value: 8,  color: "bg-chart-1" },
  { label: "Skills Shared",   value: 5,  color: "bg-chart-2" },
  { label: "Forms Submitted", value: 12, color: "bg-chart-3" },
]

const activityLog = [
  { action: "Submitted Library Access Form",       time: "2 hours ago" },
  { action: "Registered skill: Python Programming", time: "Yesterday"  },
  { action: "Completed Database Assignment",        time: "2 days ago"  },
]

let gpaCourses = [
  { id: 1, name: "Data Structures", credits: 4, grade: "A" },
  { id: 2, name: "Database Systems", credits: 3, grade: "A-" },
  { id: 3, name: "Computer Networks", credits: 3, grade: "B+" },
  { id: 4, name: "Operating Systems", credits: 4, grade: "A" },
]

let attendanceCourses = [
  { id: 1, name: "Data Structures", totalClasses: 30, attended: 27, code: "CS301" },
  { id: 2, name: "Database Systems", totalClasses: 28, attended: 23, code: "CS302" },
  { id: 3, name: "Computer Networks", totalClasses: 25, attended: 20, code: "CS303" },
  { id: 4, name: "Operating Systems", totalClasses: 32, attended: 29, code: "CS304" },
  { id: 5, name: "Software Engineering", totalClasses: 26, attended: 24, code: "CS305" },
]

let mealPlan = {
  mealSwipes: 120,
  mealSwipesUsed: 45,
  diningDollars: 500,
  diningDollarsUsed: 187,
  daysRemaining: 28,
  history: [
    { date: "Today", location: "Main Cafeteria", type: "Meal Swipe", time: "12:30 PM" },
    { date: "Today", location: "Coffee Shop", type: "Dining Rupees", amount: "₹85.00", time: "9:15 AM" },
    { date: "Yesterday", location: "Food Court", type: "Meal Swipe", time: "7:00 PM" },
    { date: "Yesterday", location: "Main Cafeteria", type: "Meal Swipe", time: "12:00 PM" },
    { date: "Yesterday", location: "Snack Bar", type: "Dining Rupees", amount: "₹52.50", time: "3:30 PM" },
  ],
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ service: "student-service", status: "ok" })
})

// GET /api/students/profile
app.get("/api/students/profile", (_req, res) => {
  res.json(profile)
})

// PUT /api/students/profile   — update name, department, gpa, etc.
app.put("/api/students/profile", (req, res) => {
  const { id, email, ...updates } = req.body || {}   // id/email immutable
  profile = { ...profile, ...updates }
  res.json(profile)
})

// GET /api/students/stats
app.get("/api/students/stats", (_req, res) => {
  res.json(stats)
})

// PATCH /api/students/stats/:label  — increment a stat counter
app.patch("/api/students/stats/:label", (req, res) => {
  const stat = stats.find((s) => s.label.toLowerCase().replace(/ /g, "-") === req.params.label)
  if (!stat) return res.status(404).json({ message: "Stat not found" })
  stat.value = req.body.value ?? stat.value + 1
  return res.json(stat)
})

// GET /api/students/activity
app.get("/api/students/activity", (_req, res) => {
  res.json(activityLog)
})

// POST /api/students/activity   — log a new recent action
app.post("/api/students/activity", (req, res) => {
  const { action, time = "Just now" } = req.body || {}
  if (!action) return res.status(400).json({ message: "action is required" })
  activityLog.unshift({ action, time })
  return res.status(201).json({ action, time })
})

app.get("/api/students/gpa/courses", (_req, res) => {
  res.json(gpaCourses)
})

app.post("/api/students/gpa/courses", (req, res) => {
  const { name, credits, grade } = req.body || {}
  if (!name || !credits || !grade) {
    return res.status(400).json({ message: "name, credits and grade are required" })
  }

  const course = { id: Date.now(), name, credits, grade }
  gpaCourses.push(course)
  return res.status(201).json(course)
})

app.delete("/api/students/gpa/courses/:id", (req, res) => {
  gpaCourses = gpaCourses.filter((course) => course.id !== Number(req.params.id))
  return res.status(204).send()
})

app.get("/api/students/attendance", (_req, res) => {
  res.json(attendanceCourses)
})

app.patch("/api/students/attendance/:id", (req, res) => {
  const course = attendanceCourses.find((item) => item.id === Number(req.params.id))
  if (!course) {
    return res.status(404).json({ message: "Attendance course not found" })
  }

  const present = Boolean(req.body?.present)
  course.totalClasses += 1
  if (present) {
    course.attended += 1
  }

  return res.json(course)
})

app.get("/api/students/meal-plan", (_req, res) => {
  res.json(mealPlan)
})

app.post("/api/students/meal-plan/swipe", (_req, res) => {
  if (mealPlan.mealSwipesUsed < mealPlan.mealSwipes) {
    mealPlan.mealSwipesUsed += 1
    mealPlan.history.unshift({
      date: "Today",
      location: "Main Cafeteria",
      type: "Meal Swipe",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })
  }

  return res.json(mealPlan)
})

app.post("/api/students/meal-plan/dining-dollars", (req, res) => {
  const amount = Number(req.body?.amount || 0)
  if (!amount || mealPlan.diningDollarsUsed + amount > mealPlan.diningDollars) {
    return res.status(400).json({ message: "Invalid dining rupee amount" })
  }

  mealPlan.diningDollarsUsed += amount
  mealPlan.history.unshift({
    date: "Today",
    location: "Campus Dining",
    type: "Dining Rupees",
    amount: `₹${amount.toFixed(2)}`,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  })

  return res.json(mealPlan)
})

// ─── Start ────────────────────────────────────────────────────────────────────
}
