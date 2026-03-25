import express from "express"
import cors from "cors"
import { notificationServiceConfig } from "./config/serviceConfig.js"
import { registerNotificationServiceRoutes } from "./routes/notificationRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerNotificationServiceRoutes(app)

app.listen(notificationServiceConfig.port, () => {
  console.log(`notification-service running on port ${notificationServiceConfig.port}`)
})
