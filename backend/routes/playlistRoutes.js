import { Router } from "express";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeVideo,
  addVideo,
  userPlaylist,
  playlistById,
} from "../controllers/PlaylistController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/createPlaylist", verifyToken, createPlaylist);
router.post("/updatePlaylist/:playlistId", verifyToken, updatePlaylist);
router.post("/addVideo", verifyToken, addVideo);
router.post("/removeVideo", verifyToken, removeVideo);
router.post("/userPlaylist/:userName", userPlaylist);

router.get("/playlist/:playlistId", playlistById);

router.delete("/deletePlaylist/:playlistId", verifyToken, deletePlaylist);

export default router;
