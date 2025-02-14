import { Router } from "express";
import { getById, sendOtpController, verifyOtpController } from "../controllers/referral.controller.js";


const router = Router();

router.post("/getOtp",
    sendOtpController
)

router.post("/verifyOtp",
    verifyOtpController
)

router.post("/getById",
    getById
)

export default router;