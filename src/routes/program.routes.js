import { Router } from "express";
import { addProgram } from "../controllers/program.controller.js";

const router = Router();

router.post("/addProgram",
    addProgram
);

export default router;