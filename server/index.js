import express from "express";
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import {connectDB} from "./dbInstance.js";
import {seedDb} from "./seed/seed.js";
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Routes primer
app.get("/", (req, res) => {
  res.send("API is running...");
});

const mongoConnection = connectDB();
console.log(mongoConnection);


// Pokretanje servera
app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await seedDb();
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});
