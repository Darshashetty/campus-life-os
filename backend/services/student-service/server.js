import express from "express"
import cors from "cors"
import { studentServiceConfig } from "./config/serviceConfig.js"
import { registerStudentServiceRoutes } from "./routes/studentRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerStudentServiceRoutes(app)

app.listen(studentServiceConfig.port, () => {
  console.log(`student-service running on port ${studentServiceConfig.port}`)
})
