import express from "express"
import cors from "cors"
import { campusServiceConfig } from "./config/serviceConfig.js"
import { registerCampusServiceRoutes } from "./routes/campusRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerCampusServiceRoutes(app)

app.listen(campusServiceConfig.port, () => {
  console.log(`campus-service running on port ${campusServiceConfig.port}`)
})
