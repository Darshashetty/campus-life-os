import express from "express"
import cors from "cors"

const app = express()
const PORT = process.env.PORT || 4002

app.use(cors())
app.use(express.json())

// ─── In-memory task store ─────────────────────────────────────────────────────
let tasks = [
  { id: 1, title: "Data Structures Assignment", date: "2026-01-08", priority: "high",   completed: false },
  { id: 2, title: "Physics Lab Report",          date: "2026-01-10", priority: "medium", completed: false },
  { id: 3, title: "Semester Fee Payment",        date: "2026-01-15", priority: "high",   completed: false },
]
let nextId = 4

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ service: "tasks-service", status: "ok" })
})

// GET /api/tasks            — list all tasks (optional ?priority=high filter)
app.get("/api/tasks", (req, res) => {
  const { priority, completed } = req.query
  let result = tasks
  if (priority) result = result.filter((t) => t.priority === priority)
  if (completed !== undefined) result = result.filter((t) => String(t.completed) === completed)
  res.json(result)
})

// GET /api/tasks/deadlines  — upcoming tasks (not completed)
app.get("/api/tasks/deadlines", (_req, res) => {
  res.json(tasks.filter((t) => !t.completed))
})

// GET /api/tasks/:id
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id))
  if (!task) return res.status(404).json({ message: "Task not found" })
  return res.json(task)
})

// POST /api/tasks           — create a task
app.post("/api/tasks", (req, res) => {
  const { title, date, priority = "medium" } = req.body || {}
  if (!title || !date) return res.status(400).json({ message: "title and date are required" })
  const task = { id: nextId++, title, date, priority, completed: false }
  tasks.push(task)
  return res.status(201).json(task)
})

// PUT /api/tasks/:id        — update a task
app.put("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Task not found" })
  tasks[index] = { ...tasks[index], ...req.body, id: tasks[index].id }
  return res.json(tasks[index])
})

// PATCH /api/tasks/:id/complete  — mark complete/incomplete
app.patch("/api/tasks/:id/complete", (req, res) => {
  const task = tasks.find((t) => t.id === Number(req.params.id))
  if (!task) return res.status(404).json({ message: "Task not found" })
  task.completed = req.body.completed ?? !task.completed
  return res.json(task)
})

// DELETE /api/tasks/:id     — remove a task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex((t) => t.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ message: "Task not found" })
  tasks.splice(index, 1)
  return res.status(204).send()
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`tasks-service running on port ${PORT}`)
})
