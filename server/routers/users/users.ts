import express from "express";
import { UserController } from "../../controllers/users/users";
import { SupabaseClient } from "@supabase/supabase-js";

export const userRouter = (supabase: SupabaseClient) => {
  const userController = UserController(supabase);
  const router = express.Router();

  router.post("/new", async (req, res) => {
    const newUser = req.body;
    const createdUser = await userController.create(newUser);
    res.json(createdUser);
  });

  router.get("/id/:id", async (req, res) => {
    const userId = req.params.id;
    console.log(req.params);
    const user = await userController.findById(userId);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  });

  router.get("/username/:username", async (req, res) => {
    const username = req.params.username;
    console.log(req.params);
    const user = await userController.findByUsername(username);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  });

  router.get("/email/:email", async (req, res) => {
    const email = req.params.email;
    console.log(req.params);
    const user = await userController.findByEmail(email);
    if (user) {
      res.json(user);
    } else {
      res.status(404).send({ error: "User not found" });
    }
  });

  router.get("/", async (req, res) => {
    const users = await userController.findAll();
    res.json(users);
  });



  return router;
};
