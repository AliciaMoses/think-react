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

  router.get("/users/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(req.params);
    const user = await userController.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  });

  return router;
};
