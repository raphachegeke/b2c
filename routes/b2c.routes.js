import express from "express";
import { sendB2C, handleResult, handleTimeout } from "../controllers/b2c.controller.js";

const router = express.Router();

router.post("/send", sendB2C);
router.post("/result", handleResult);
router.post("/timeout", handleTimeout);

export default router;
