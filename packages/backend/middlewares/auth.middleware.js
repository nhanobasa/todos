const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const access_token = req.headers.authorization.replace("Bearer", "").trim()
  if (access_token) {
    jwt.verify(access_token, process.env.JWT_SECRET_KEY, function (
      err,
      decoded
    ) {
      if (err) {
        return res.status(401).json({
          error: {
            message: "Unauthorized access_token",
          },
        })
      }
      req.decoded = decoded // truyền dữ liệu từ middleware sang controller tiếp theo để sử dụng.
      next()
    })
  } else {
    // if there is no access_token, return an error
    return res.status(403).json({
      error: {
        message: " No access_token provided",
      },
    })
  }
}
