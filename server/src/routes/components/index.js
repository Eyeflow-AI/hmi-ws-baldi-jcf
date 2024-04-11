import express from "express";
import { Get, Post } from "./pages";

const router = express.Router();

router.get("/:stationId/:scriptName", Get);
router.post("/:stationId/:scriptName", Post);

export default router;
