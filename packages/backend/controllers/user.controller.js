const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

module.exports = {
  register: async (req, res) => {
    try {
      const user = new userModel(req.body)
      await user.save()
      let payload = { user_id: user.id, username: user.username }
      let access_token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "30m",
      })
      let refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
        expiresIn: "365d",
      })

      res.status(200).json({
        username: user.username,
        access_token: access_token,
        refresh_token: refresh_token,
      })
    } catch (err) {
      res.status(500).send(err)
    }
  },
}
