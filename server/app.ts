import express, { Express } from "express";
import cors from "cors";
import { createDbClient } from "./utils/db.connection";
import { userRouter } from "./routers/users/users"

const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const supabase = createDbClient();

  app.use("/users", userRouter);

  return app;
};

export default createApp;
