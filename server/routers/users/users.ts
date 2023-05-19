import express from "express";
import { UserController } from "../../controllers/users/users";
import { SupabaseClient } from "@supabase/supabase-js";

export const userRouter = (supabase: SupabaseClient) => {
  const userController = UserController(supabase);
  const router = express.Router();

  router.post("/users", async (req, res) => {
    const newUser = req.body;
    const createdUser = await userController.create(newUser);
    res.json(createdUser);
  });

  return router;
};
