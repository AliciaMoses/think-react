import dotenv from "dotenv";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

dotenv.config();

export const createDbClient = (): SupabaseClient => {
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

  return supabase;
};
