const express = require("express")
const router = express.Router()
const { register } = require("../controllers/user.controller")
router.get("/", (req, res) => {
  res.json({
    msg: "Hello",
  })
})

router.post("/register", register)

module.exports = router
