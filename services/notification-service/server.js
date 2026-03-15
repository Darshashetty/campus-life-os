import express from "express"
import cors from "cors"
import axios from "axios"

const app = express()
const port = process.env.PORT || 4004
const tasksServiceUrl = process.env.TASKS_SERVICE_URL || "http://localhost:4002"

app.use(cors())
app.use(express.json())

app.get("/health", (_req, res) => {
  res.json({ service: "notification-service", status: "ok" })
})

app.get("/api/notifications/reminders", async (_req, res) => {
  try {
    const deadlinesResponse = await axios.get(`${tasksServiceUrl}/api/tasks/deadlines`)

    const reminders = deadlinesResponse.data.map((deadline, index) => ({
      id: index + 1,
      type: deadline.priority === "high" ? "warning" : "info",
      message: `${deadline.title} is due on ${deadline.date}`,
      priority: deadline.priority,
    }))

    return res.json(reminders)
  } catch {
    return res.status(502).json({ message: "Failed to load reminders from tasks service" })
  }
})

// In-memory notification store
const notifications = []

app.post("/api/notifications/alert", (req, res) => {
  const { title, message } = req.body || {}
  if (!title || !message) {
    return res.status(400).json({ message: "title and message are required" })
  }
  const notification = { id: Date.now(), title, message, read: false, createdAt: new Date().toISOString() }
  notifications.unshift(notification)
  return res.status(201).json({ status: "queued", notification })
})

// GET /api/notifications         — all queued notifications
app.get("/api/notifications", (_req, res) => {
  res.json(notifications)
})

// PATCH /api/notifications/:id/read  — mark one as read
app.patch("/api/notifications/:id/read", (req, res) => {
  const n = notifications.find((x) => x.id === Number(req.params.id))
  if (!n) return res.status(404).json({ message: "Notification not found" })
  n.read = true
  return res.json(n)
})

// DELETE /api/notifications/:id  — dismiss one
app.delete("/api/notifications/:id", (req, res) => {
  const index = notifications.findIndex((x) => x.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Notification not found" })
  notifications.splice(index, 1)
  return res.status(204).send()
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(port, () => {
  console.log(`notification-service running on port ${port}`)
})
