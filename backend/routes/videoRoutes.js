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
  videoById,
  getWatchHistory,
  removeFromHistory,
  videoByCategory,
  categoryList,
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
router.post("/getVideo/:videoId", getVideoById);

router.get("/progress", getUploadProgress);
router.get("/add_To_Watched/:videoId", verifyToken, addVideoToWatched);
router.get("/updateViews/:videoId", verifyToken, updateViews);
router.get("/video/:videoId", verifyToken, videoById);
router.get("/watchHistory", verifyToken, getWatchHistory);
router.get("/removeHistory/:videoId", verifyToken, removeFromHistory);
router.get("/video", videoByCategory);
router.get("/categoryList", categoryList)

router.delete("/deleteVideo/:id", verifyToken, deleteVideo);

export default router;
