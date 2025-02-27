import { Router } from "express";
import {
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideo,
  updateViews,
  addVideoToWatched,
  getUploadProgress,
} from "../controllers/VideoController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.post(
  "/createVideo",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  verifyToken,
  createVideo
);
router.post(
  "/updateVideo/:id",
  verifyToken,
  upload.single("thumbnail"),
  updateVideo
);
router.post("/getAllVideo", getAllVideo);
router.post(
  "/upload",
  upload.fields([{ name: "chunk" }, { name: "thumbnail", maxCount: 1 }]),
  verifyToken,
  createVideo
);
router.get("/progress", getUploadProgress);

router.get("/add_To_Watched/:videoId", verifyToken, addVideoToWatched);
router.get("/getVideo/:videoId", getVideoById);
router.get("/updateViews/:videoId", verifyToken, updateViews);

router.delete("/deleteVideo/:id", verifyToken, deleteVideo);

export default router;
