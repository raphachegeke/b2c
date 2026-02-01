import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import b2cRoutes from "./routes/b2c.routes.js";

dotenv.config();
const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use("/api/b2c", b2cRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
