const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  updateUserPassword,
  updatePassword,
  updateDocument,
  getChecklistByCategory
} = require("./userController");
// const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/me", getMe);
router.post("/password/:userId", updatePassword);
router.patch('/:id',updateDocument)
router.get("/checklists/:category", getChecklistByCategory);

module.exports = router;
