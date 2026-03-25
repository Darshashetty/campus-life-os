import express from "express"
import cors from "cors"
import { authServiceConfig } from "./config/serviceConfig.js"
import { registerAuthServiceRoutes } from "./routes/userRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

registerAuthServiceRoutes(app)

app.listen(authServiceConfig.port, () => {
  console.log(`auth-service running on port ${authServiceConfig.port}`)
})
