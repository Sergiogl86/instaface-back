import express from "express";

import { addMessage } from "../controller/messageController";

import Auth from "../middlewares/auth";

const router = express.Router();

router.post("/crear", Auth, addMessage);

export default router;
