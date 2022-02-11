import express from "express";

import { addMessage, deleteMessage } from "../controller/messageController";

import Auth from "../middlewares/auth";

const router = express.Router();

router.post("/crear", Auth, addMessage);

router.post("/borrar", Auth, deleteMessage);

export default router;
