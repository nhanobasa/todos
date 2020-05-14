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
  login: async (req, res) => {
    try {
      const { username, password } = req.body
      const user = await userModel.findByCredentials(username, password)
      if (!user) {
        return res.status(401).json({
          error: "Login failed! Check authentication credentials.",
        })
      }
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
      console.log(err)
      res.status(400).json({ error: err.message })
    }
  },
  refreshToken: (req, res) => {
    const refreshTokenFromClient = req.body.refresh_token
    if (refreshTokenFromClient) {
      jwt.verify(refreshTokenFromClient, process.env.JWT_REFRESH_KEY, function (
        err,
        decoded
      ) {
        if (err) {
          return res.status(401).json({ error: err })
        }
        return res.status(200).json({
          access_token: jwt.sign(decoded, process.env.JWT_SECRET_KEY, {
            expiresIn: "30m",
          }),
        })
      })
    } else {
      // if there is no refresh token from client, return an error
      return res.status(403).json({
        error: "No refresh token provided",
      })
    }
  },
}
