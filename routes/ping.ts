import express from "express";
import pingServer from "../controllers/ping";
const router = express.Router();

// TODO: tag needs to be dynamic
router.get("/", pingServer);

export default router;
