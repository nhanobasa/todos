require("dotenv").config()
const express = require("express")
const app = express()
const logger = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const apiRoute = require("./routers")

const port = process.env.PORT || 3000
app.use(logger("dev"))
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.listen(port, () => {
  console.log(`App Todos listening at http://localhost:${port}`)
})

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
  (err) => {
    if (err) console.error(err)
    else console.log("Connected to MongoDB")
  }
)

app.use("/api", apiRoute)
