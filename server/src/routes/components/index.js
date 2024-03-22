import express from "express";
import { Get } from "./pages";

const router = express.Router();

router.get("/:stationId/:scriptName", Get);

export default router;
