import {
  userDetails,  
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
  updateUser,
  channelDetails,
} from "../controllers/UserController.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/refresh_token", refreshAccessToken);
router.post("/updatePassword", verifyToken, updatePassword);
router.post(
  "/updateUser",
  verifyToken,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateUser
);

router.get("/user", verifyToken, userDetails);
router.post("/channel/:userName", channelDetails);


export default router;
