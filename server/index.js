import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import {connectDB} from "./dbInstance.js";
import {seedDb} from "./seed/seed.js";
import userRouter from "./routes/userRoutes.js";
import erasmusCompetitionRouter from "./routes/erasmusCompetition.js";
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//Sve rute
app.use(userRouter);
app.use(erasmusCompetitionRouter);

const mongoConnection = connectDB();
console.log(mongoConnection);


// Pokretanje servera
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await seedDb();
})

