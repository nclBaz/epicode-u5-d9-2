import express from "express"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import passport from "passport"
import usersRouter from "./users/index.js"
import {
  forbiddenErrorHandler,
  genericErroHandler,
  notFoundErrorHandler,
  unauthorizedErrorHandler,
} from "./errorHandlers.js"
import googleStrategy from "./lib/auth/google.js"

const server = express()
const port = process.env.PORT || 3001

passport.use("google", googleStrategy) // Do not forget to inform Passport that we need to use GoogleStrategy

// ******************************** MIDDLEWARES *********************************

server.use(cors())
server.use(express.json())
server.use(passport.initialize()) // Do not forget to inform Express that we need to use Passport

// ************************************* ENDPOINTS *******************************

server.use("/users", usersRouter)

// ********************************** ERROR HANDLERS *****************************

server.use(unauthorizedErrorHandler)
server.use(forbiddenErrorHandler)
server.use(notFoundErrorHandler)
server.use(genericErroHandler)

mongoose.connect(process.env.MONGO_CONNECTION)

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log(`Server is listening on port ${port}`)
  })
})
