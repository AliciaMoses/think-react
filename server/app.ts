// This file is responsible for express configuration, please delete this comment after PR / code review 

import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";



const createApp = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables"
    );
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

 

  supabase
    .from("test")
    .select()
    .limit(1)
    .then(({ data, error }) => {
      if (error) {
        console.error("Failed to connect to the Supabase database:", error);
      } else {
        console.log("Connected to the Supabase database successfully");
      }
      console.log(data);
    });

  return app;
};

export default createApp;

