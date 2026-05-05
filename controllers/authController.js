const User = require("../models/User");
const Teacher = require("../models/Teacher");
const jwt = require("jsonwebtoken");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "8h" });
};

// ─── Register User ────────────────────────────────────────────────────────────
exports.registerUser = async (req, res) => {
  const { fullName, email, password, role, securityPin, profileImageUrl } = req.body;

  if (!fullName || !email || !password || !securityPin) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }
  if (!/^\d{4}$/.test(securityPin)) {
    return res.status(400).json({ message: "Security PIN must be exactly 4 digits" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userRole = role || 'admin';

    const user = await User.create({
      fullName,
      email,
      password,
      role: userRole,
      securityPin,
      profileImageUrl,
    });

    // ── Auto-create Teacher record when role is teacher ──────────────────────
    if (userRole === 'teacher') {
      // Generate a unique teacher ID
      const teacherCount = await Teacher.countDocuments();
      const teacherId = `TCH${String(teacherCount + 1).padStart(4, '0')}`;

      // Check if a teacher with this email already exists
      const existingTeacher = await Teacher.findOne({ email });
      if (!existingTeacher) {
        await Teacher.create({
          teacherId,
          name: fullName,
          email,
          // Other fields left blank — teacher fills them in later via requests
          gender: '',
          subject: '',
          class: '',
          section: '',
          address: '',
          mobile: '',
          photo: profileImageUrl || '',
        });
      }
    }

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};

// ─── Step 1: Verify email + password ─────────────────────────────────────────
exports.loginStep1 = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return a short-lived step token so the client can proceed to step 2
    const stepToken = jwt.sign(
      { id: user._id, step: 1 },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({
      message: "Step 1 passed",
      stepToken,
      role: user.role,
      fullName: user.fullName,
    });
  } catch (error) {
    res.status(500).json({ message: "Error in login step 1", error: error.message });
  }
};

// ─── Step 2: Verify role ──────────────────────────────────────────────────────
exports.loginStep2 = async (req, res) => {
  const { stepToken, role } = req.body;

  if (!stepToken || !role) {
    return res.status(400).json({ message: "Step token and role are required" });
  }

  try {
    const decoded = jwt.verify(stepToken, process.env.JWT_SECRET);
    if (decoded.step !== 1) {
      return res.status(401).json({ message: "Invalid step token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== role) {
      return res.status(401).json({ message: "Role does not match your account" });
    }

    const stepToken2 = jwt.sign(
      { id: user._id, step: 2 },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ message: "Step 2 passed", stepToken: stepToken2 });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// ─── Step 3: Verify security PIN ─────────────────────────────────────────────
exports.loginStep3 = async (req, res) => {
  const { stepToken, pin } = req.body;

  if (!stepToken || !pin) {
    return res.status(400).json({ message: "Step token and PIN are required" });
  }

  try {
    const decoded = jwt.verify(stepToken, process.env.JWT_SECRET);
    if (decoded.step !== 2) {
      return res.status(401).json({ message: "Invalid step token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const pinMatch = await user.comparePin(pin);
    if (!pinMatch) {
      return res.status(401).json({ message: "Incorrect security PIN" });
    }

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  const { fullName, email, profileImageUrl } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (fullName) user.fullName = fullName;
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }
    if (profileImageUrl) user.profileImageUrl = profileImageUrl;

    await user.save();
    res.status(200).json({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Both current and new password are required' });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// ─── Change Security PIN ──────────────────────────────────────────────────────
exports.changePin = async (req, res) => {
  const { currentPin, newPin } = req.body;
  if (!currentPin || !newPin) {
    return res.status(400).json({ message: 'Both current and new PIN are required' });
  }
  if (!/^\d{4}$/.test(newPin)) {
    return res.status(400).json({ message: 'New PIN must be exactly 4 digits' });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await user.comparePin(currentPin);
    if (!match) return res.status(401).json({ message: 'Current PIN is incorrect' });

    user.securityPin = newPin;
    await user.save();
    res.status(200).json({ message: 'Security PIN updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing PIN', error: error.message });
  }
};
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -securityPin");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user info", error: error.message });
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error changing password', error: err.message });
  }
};

// ─── Update Profile ───────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, profileImageUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, email, profileImageUrl },
      { new: true }
    ).select('-password -securityPin');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
