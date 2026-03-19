import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()
const PORT = process.env.PORT || 4000
const studentServiceUrl = process.env.STUDENT_SERVICE_URL || "https://student-service-aszb.onrender.com"
const tasksServiceUrl = process.env.TASKS_SERVICE_URL || "https://darsha-tasks-service.onrender.com"
const authServiceUrl = process.env.AUTH_SERVICE_URL || "https://auth-service-cj6i.onrender.com"
const notificationServiceUrl = process.env.NOTIFICATION_SERVICE_URL || "https://darsha-notification-service.onrender.com"
const campusServiceUrl = process.env.CAMPUS_SERVICE_URL || "https://darsha-campus-service.onrender.com"

app.use(cors())
app.use(express.json())

// ─── Logging middleware ───────────────────────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`[gateway] ${new Date().toISOString()}  ${req.method}  ${req.path}`)
  next()
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const forwardAuthHeader = (req) => {
  const authHeader = req.headers.authorization
  return authHeader ? { Authorization: authHeader } : {}
}

const proxyRequest = async (res, requestPromise) => {
  try {
    const response = await requestPromise
    // 204 No Content has no body
    if (response.status === 204) return res.status(204).send()
    return res.status(response.status).json(response.data)
  } catch (error) {
    const status = error.response?.status || 502
    return res.status(status).json(error.response?.data || { message: "Gateway proxy error" })
  }
}

app.get("/health", (_req, res) => {
  res.json({ service: "api-gateway", status: "ok" })
})

app.get("/api/services/health", async (_req, res) => {
  const checks = [
    { name: "student-service", url: `${studentServiceUrl}/health` },
    { name: "tasks-service", url: `${tasksServiceUrl}/health` },
    { name: "auth-service", url: `${authServiceUrl}/health` },
    { name: "notification-service", url: `${notificationServiceUrl}/health` },
    { name: "campus-service", url: `${campusServiceUrl}/health` },
  ]

  const results = await Promise.allSettled(checks.map((check) => axios.get(check.url)))

  const services = results.map((result, index) => {
    const check = checks[index]
    if (result.status === "fulfilled") {
      return {
        service: check.name,
        status: "ok",
        url: check.url,
      }
    }

    return {
      service: check.name,
      status: "error",
      url: check.url,
      reason: result.reason?.message || "request failed",
    }
  })

  const allHealthy = services.every((item) => item.status === "ok")
  if (!allHealthy) {
    return res.status(502).json({
      message: "Unable to reach all services",
      gateway: { service: "api-gateway", status: "ok" },
      services,
    })
  }

  return res.json({
    gateway: { service: "api-gateway", status: "ok" },
    services,
  })
})

app.post("/api/auth/register", async (req, res) => {
  return proxyRequest(res, axios.post(`${authServiceUrl}/api/auth/register`, req.body))
})

app.post("/api/auth/login", async (req, res) => {
  return proxyRequest(res, axios.post(`${authServiceUrl}/api/auth/login`, req.body))
})

app.post("/api/auth/refresh", async (req, res) => {
  return proxyRequest(res, axios.post(`${authServiceUrl}/api/auth/refresh`, req.body))
})

app.get("/api/auth/verify", async (req, res) => {
  return proxyRequest(
    res,
    axios.get(`${authServiceUrl}/api/auth/verify`, { headers: forwardAuthHeader(req) }),
  )
})

app.get("/api/auth/me", async (req, res) => {
  return proxyRequest(
    res,
    axios.get(`${authServiceUrl}/api/auth/me`, { headers: forwardAuthHeader(req) }),
  )
})

// ─── Student Service routes (:4001) ──────────────────────────────────────────
app.get("/api/students/profile", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/profile`))
})
app.put("/api/students/profile", async (req, res) => {
  return proxyRequest(res, axios.put(`${studentServiceUrl}/api/students/profile`, req.body))
})
app.get("/api/students/stats", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/stats`))
})
app.patch("/api/students/stats/:label", async (req, res) => {
  return proxyRequest(res, axios.patch(`${studentServiceUrl}/api/students/stats/${req.params.label}`, req.body))
})
app.get("/api/students/activity", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/activity`))
})
app.post("/api/students/activity", async (req, res) => {
  return proxyRequest(res, axios.post(`${studentServiceUrl}/api/students/activity`, req.body))
})
app.get("/api/students/gpa/courses", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/gpa/courses`))
})
app.post("/api/students/gpa/courses", async (req, res) => {
  return proxyRequest(res, axios.post(`${studentServiceUrl}/api/students/gpa/courses`, req.body))
})
app.delete("/api/students/gpa/courses/:id", async (req, res) => {
  return proxyRequest(res, axios.delete(`${studentServiceUrl}/api/students/gpa/courses/${req.params.id}`))
})
app.get("/api/students/attendance", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/attendance`))
})
app.patch("/api/students/attendance/:id", async (req, res) => {
  return proxyRequest(res, axios.patch(`${studentServiceUrl}/api/students/attendance/${req.params.id}`, req.body))
})
app.get("/api/students/meal-plan", async (_req, res) => {
  return proxyRequest(res, axios.get(`${studentServiceUrl}/api/students/meal-plan`))
})
app.post("/api/students/meal-plan/swipe", async (_req, res) => {
  return proxyRequest(res, axios.post(`${studentServiceUrl}/api/students/meal-plan/swipe`))
})
app.post("/api/students/meal-plan/dining-dollars", async (req, res) => {
  return proxyRequest(res, axios.post(`${studentServiceUrl}/api/students/meal-plan/dining-dollars`, req.body))
})

// ─── Tasks Service routes (:4002) ─────────────────────────────────────────────
app.get("/api/tasks", async (req, res) => {
  return proxyRequest(res, axios.get(`${tasksServiceUrl}/api/tasks`, { params: req.query }))
})
app.get("/api/tasks/deadlines", async (_req, res) => {
  return proxyRequest(res, axios.get(`${tasksServiceUrl}/api/tasks/deadlines`))
})
app.get("/api/tasks/:id", async (req, res) => {
  return proxyRequest(res, axios.get(`${tasksServiceUrl}/api/tasks/${req.params.id}`))
})
app.post("/api/tasks", async (req, res) => {
  return proxyRequest(res, axios.post(`${tasksServiceUrl}/api/tasks`, req.body))
})
app.put("/api/tasks/:id", async (req, res) => {
  return proxyRequest(res, axios.put(`${tasksServiceUrl}/api/tasks/${req.params.id}`, req.body))
})
app.patch("/api/tasks/:id/complete", async (req, res) => {
  return proxyRequest(res, axios.patch(`${tasksServiceUrl}/api/tasks/${req.params.id}/complete`, req.body))
})
app.delete("/api/tasks/:id", async (req, res) => {
  return proxyRequest(res, axios.delete(`${tasksServiceUrl}/api/tasks/${req.params.id}`))
})

// ─── Notification Service routes (:4004) ──────────────────────────────────────
app.get("/api/notifications", async (_req, res) => {
  return proxyRequest(res, axios.get(`${notificationServiceUrl}/api/notifications`))
})
app.get("/api/notifications/reminders", async (_req, res) => {
  return proxyRequest(res, axios.get(`${notificationServiceUrl}/api/notifications/reminders`))
})
app.post("/api/notifications/alert", async (req, res) => {
  return proxyRequest(res, axios.post(`${notificationServiceUrl}/api/notifications/alert`, req.body))
})
app.patch("/api/notifications/:id/read", async (req, res) => {
  return proxyRequest(res, axios.patch(`${notificationServiceUrl}/api/notifications/${req.params.id}/read`, req.body))
})
app.delete("/api/notifications/:id", async (req, res) => {
  return proxyRequest(res, axios.delete(`${notificationServiceUrl}/api/notifications/${req.params.id}`))
})

// ─── Campus Service routes (:4005) ───────────────────────────────────────────
app.get("/api/lost-found/items", async (req, res) => {
  return proxyRequest(res, axios.get(`${campusServiceUrl}/api/lost-found/items`, { params: req.query }))
})
app.post("/api/lost-found/items", async (req, res) => {
  return proxyRequest(res, axios.post(`${campusServiceUrl}/api/lost-found/items`, req.body))
})
app.post("/api/lost-found/contact", async (req, res) => {
  return proxyRequest(res, axios.post(`${campusServiceUrl}/api/lost-found/contact`, req.body))
})
app.get("/api/directory/people", async (req, res) => {
  return proxyRequest(res, axios.get(`${campusServiceUrl}/api/directory/people`, { params: req.query }))
})
app.get("/api/campus/locations", async (req, res) => {
  return proxyRequest(res, axios.get(`${campusServiceUrl}/api/campus/locations`, { params: req.query }))
})
app.get("/api/rides", async (req, res) => {
  return proxyRequest(res, axios.get(`${campusServiceUrl}/api/rides`, { params: req.query }))
})
app.post("/api/rides", async (req, res) => {
  return proxyRequest(res, axios.post(`${campusServiceUrl}/api/rides`, req.body))
})
app.patch("/api/rides/:id/request", async (req, res) => {
  return proxyRequest(res, axios.patch(`${campusServiceUrl}/api/rides/${req.params.id}/request`, req.body))
})
app.delete("/api/rides/:id", async (req, res) => {
  return proxyRequest(res, axios.delete(`${campusServiceUrl}/api/rides/${req.params.id}`))
})
app.get("/api/notes", async (req, res) => {
  return proxyRequest(res, axios.get(`${campusServiceUrl}/api/notes`, { params: req.query }))
})
app.post("/api/notes", async (req, res) => {
  return proxyRequest(res, axios.post(`${campusServiceUrl}/api/notes`, req.body))
})
app.patch("/api/notes/:id/download", async (req, res) => {
  return proxyRequest(res, axios.patch(`${campusServiceUrl}/api/notes/${req.params.id}/download`, req.body))
})
app.post("/api/helpbot/chat", async (req, res) => {
  return proxyRequest(res, axios.post(`${campusServiceUrl}/api/helpbot/chat`, req.body))
})

// ─── Aggregate endpoint ───────────────────────────────────────────────────────
app.get("/api/dashboard-summary", async (_req, res) => {
  try {
    const [statsRes, deadlinesRes, remindersRes, profileRes, activityRes] = await Promise.all([
      axios.get(`${studentServiceUrl}/api/students/stats`),
      axios.get(`${tasksServiceUrl}/api/tasks/deadlines`),
      axios.get(`${notificationServiceUrl}/api/notifications/reminders`),
      axios.get(`${studentServiceUrl}/api/students/profile`),
      axios.get(`${studentServiceUrl}/api/students/activity`),
    ])

    res.json({
      profile:          profileRes.data,
      activityStats:    statsRes.data,
      upcomingDeadlines: deadlinesRes.data,
      reminders:        remindersRes.data,
      recentActivity:   activityRes.data,
      source: "microservices",
    })
  } catch (error) {
    console.error("Gateway aggregation failed", error?.message)
    res.status(502).json({ message: "Unable to fetch dashboard data from services", source: "gateway" })
  }
})

// ─── 404 catch-all ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.path}`,
    availableAt: "GET /api/services/health",
  })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`api-gateway running on port ${PORT}`)
})
