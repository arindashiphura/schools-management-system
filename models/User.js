const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'dos', 'bursar', 'teacher', 'student'],
      default: 'admin',
    },
    securityPin: {
      type: String, // hashed 4-digit PIN
      required: true,
      default: '0000',
    },
    profileImageUrl: {
      type: String,
      default: "default.null",
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  if (this.isModified('securityPin')) {
    this.securityPin = await bcrypt.hash(this.securityPin, 10);
  }
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compare security PIN
UserSchema.methods.comparePin = async function (candidatePin) {
  return await bcrypt.compare(candidatePin, this.securityPin);
};

module.exports = mongoose.model('User', UserSchema);
