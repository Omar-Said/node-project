import express from "express";
import pingServer from "../controllers/ping";
const router = express.Router();

router.get("/", pingServer);

export default router;
