import express from "express";
import cors from "cors";
import movieRouter from "../controllers/movies.js";
import userRouter from "../controllers/users.js";
import theatreRouter from "../controllers/theatre.js"
import adminRouter from "../controllers/admin.js";
import paymentRouter from "../controllers/payment.js";
import ticketRouter from "../controllers/ticket.js";

const createServer = () => {
  const app = express();

  app.use(express.json());

  app.use(cors());

  app.use("/api/users", userRouter);
  app.use("/api/movies", movieRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/theatre", theatreRouter);
  app.use("/api/ticket", ticketRouter);
  app.use("/api/payment", paymentRouter);

  return app;
};

export default createServer;
