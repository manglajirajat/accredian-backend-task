import { PrismaClient } from "@prisma/client";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

const prisma = new PrismaClient();

const addProgram = AsyncHandler(async (req, res) => {
    const { name, refereer_bonus, referee_bonus } = req.body;

    if (!name || !refereer_bonus || !referee_bonus) {
        throw new ApiError(400, "All fields are required");
    }

    const program = await prisma.program.create({
        data: {
            name,
            refereer_bonus : parseInt(refereer_bonus, 10),
            referee_bonus : parseInt(referee_bonus, 10),
        },
    });

    if(!program){
        throw new ApiError(500, "Failed to create program");
    }

    res.status(201).json(new ApiResponse(201, program, "Program created successfully"));
});

export { addProgram };

