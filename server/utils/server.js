import express from "express";
import cors from "cors";
import userRouter from "../controllers/users.js";

const createServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use("/api/users", userRouter);

  return app;
};

export default createServer;
