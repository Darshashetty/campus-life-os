import express from "express"
import cors from "cors"
import { tasksServiceConfig } from "./config/serviceConfig.js"
import { registerTasksServiceRoutes } from "./routes/taskRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerTasksServiceRoutes(app)

app.listen(tasksServiceConfig.port, () => {
  console.log(`tasks-service running on port ${tasksServiceConfig.port}`)
})
