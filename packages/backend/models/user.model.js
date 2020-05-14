const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minlength: 6,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validator: (value) => {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address")
      }
    },
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 18,
    required: true,
  },
})

userSchema.pre("save", async function (next) {
  try {
    this.password = await bcrypt.hash(this.password, 10)
  } catch (err) {
    throw err
  }
})

userSchema.statics.findByCredentials = async (username, password) => {
  // Search for a user by email and password.
  try {
    const user = await User.findOne({ username })
    if (!user) {
      throw new Error("Invalid login credentials")
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch) {
      throw new Error("Invalid login credentials")
    }
    return user
  } catch (err) {
    throw err
  }
}
const User = mongoose.model("users", userSchema)
module.exports = User
