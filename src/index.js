import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({path: "../.env"});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
});

//routes
import referralRoutes from "./routes/referral.routes.js";
import programRoutes from "./routes/program.routes.js";

app.use("/api/v1/referral", referralRoutes);
app.use("/api/v1/program", programRoutes);