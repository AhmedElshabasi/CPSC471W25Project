import express from "express";
import cors from "cors";
import movieRouter from "../controllers/movies.js";
import userRouter from "../controllers/users.js";
import adminRouter from "../controllers/admin.js";

const createServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use("/api/users", userRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/admin", adminRouter);

  return app;
};

export default createServer;
