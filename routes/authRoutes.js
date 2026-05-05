const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  registerUser,
  loginStep1,
  loginStep2,
  loginStep3,
  getUserInfo,
  updateProfile,
  changePassword,
  changePin,
} = require("../controllers/authController");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login/step1", loginStep1);
router.post("/login/step2", loginStep2);
router.post("/login/step3", loginStep3);
router.get("/getUser", protect, getUserInfo);
router.put("/update-profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.put("/change-pin", protect, changePin);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ imageUrl });
});

module.exports = router;
