const express = require("express")
const router = express.Router()
const { register, login } = require("../controllers/user.controller")
router.get("/", (req, res) => {
  res.json({
    msg: "Hello",
  })
})

router.post("/register", register)
router.post("/login", login)

module.exports = router
