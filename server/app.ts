import express, { Express } from "express";
import cors from "cors";
import { createDbClient } from "./utils/db.connection";

const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const supabase = createDbClient();



  return app;
};

export default createApp;
