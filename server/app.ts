import express, { Express } from "express";
import cors from "cors";
import { createDbClient } from "./utils/db.connection";
import { userRouter } from "./routers/users/users"

const createApp = (): Express => {
  const app = express();

  app.use(express.json());


  const corsOptions = {
    origin: 'http://localhost:3000',  
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));  

  const supabase = createDbClient();

  app.use("/users", userRouter(supabase));

  return app;
};

export default createApp