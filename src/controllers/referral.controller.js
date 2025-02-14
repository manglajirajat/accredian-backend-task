import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { sendOtp } from "../utils/sendOtp.js";

const prisma = new PrismaClient();

const sendOtpController = AsyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const existingReferral = await prisma.referral.findUnique({
        where: { email },
    });

    if (existingReferral) {
        throw new ApiError(400, "User already referred");
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await prisma.otp.create({
        data: {
            email,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
    });

    sendOtp(email, otp);

    res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOtpController = AsyncHandler(async (req, res) => {
    const { email, otp, name, referredBy, p_id } = req.body;

    if (!email || !otp || !name || !p_id) {
        throw new ApiError(400, "All fields are required");
    }

    const otpRecord = await prisma.otp.findUnique({
        where: { email },
    });

    if (!otpRecord) {
        throw new ApiError(400, "OTP not found");
    }

    if (otpRecord.otp !== parseInt(otp, 10)) {
        throw new ApiError(400, "Invalid OTP");
    }

    if (new Date() > otpRecord.expiresAt) {
        throw new ApiError(400, "OTP expired");
    }

    const bonus = await prisma.program.findUnique({
        where: { id:p_id },
    });

    if (!bonus) {
        throw new ApiError(400, "Invalid Program ID");
    }

    let referredByReferral = null;
    if (referredBy) {
        referredByReferral = await prisma.referral.findUnique({
            where: { referralCode: referredBy },
        });

        if (!referredByReferral) {
            throw new ApiError(400, "Invalid referral code");
        }
    }

    const newReferral = await prisma.referral.create({
        data: { 
            name, 
            email, 
            p_id,
            referredBy, 
            reward_earned: bonus.referee_bonus
        },
    });

    if (referredByReferral) {
        await prisma.referral.update({
            where: { referralCode: referredBy },
            data: { 
                reward_earned: referredByReferral.reward_earned + bonus.refereer_bonus 
            },
        });
    }

    await prisma.otp.delete({
        where: { email },
    });

    res.status(201).json(new ApiResponse(201, newReferral, "Referral created successfully"));
});

const getById = AsyncHandler(async (req, res) => {
    const { id } = req.body;

    if(!id) {
        throw new ApiError(400, "Referral ID is required");
    }

    const referral = await prisma.referral.findUnique({
        where: { id},
    });

    if (!referral) {
        throw new ApiError(404, "Referral not found");
    }

    res.status(200).json(new ApiResponse(200, referral, null));
});

export { sendOtpController, verifyOtpController,getById };
