import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import dotenv from "dotenv";
import {connectDB} from "./dbInstance.js";
import {seedDb} from "./seed/seed.js";
import userRouter from "./routes/userRoutes.js";
import erasmusCompetitionRouter from "./routes/erasmusCompetition.js";
import authenticationRouter from "./routes/authenticationRoutes.js"
import branchRoutes from "./routes/branchRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import institutionRoutes from "./routes/institutionRoutes.js";
import {erasmusApplicationRouter} from "./routes/erasmusApplicationeRoutes.js";
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

app.use(userRouter);
app.use(erasmusCompetitionRouter);
app.use(branchRoutes)
app.use(categoryRouter)
app.use(institutionRoutes)
app.use(authenticationRouter);
app.use(erasmusApplicationRouter)

const mongoConnection = connectDB();
console.log(mongoConnection);


app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await seedDb();
})

