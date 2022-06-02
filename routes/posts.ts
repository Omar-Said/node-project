import express from "express";
import fetchPosts from "../controllers/posts";
const router = express.Router();

// TODO: tag needs to be dynamic
router.get("/", fetchPosts);

export default router;
