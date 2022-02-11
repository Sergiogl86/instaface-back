import express from "express";

import { addUser } from "../controller/usersController";

const router = express.Router();

router.post("/register", addUser);

export default router;
