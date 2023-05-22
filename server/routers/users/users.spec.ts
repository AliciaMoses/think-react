import dotenv from "dotenv";
import request from "supertest";
import express from "express";
import { userRouter } from "./users";
import { UserController } from "../../controllers/users/users";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.TEST_SUPABASE_URL;
const supabaseAnonKey = process.env.TEST_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const app = express();
app.use(express.json());

app.use(userRouter(supabase));

const userController = UserController(supabase);

describe("User Router", () => {
  beforeAll(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .neq("created_at", "2000-05-19 12:05:07.784723+00");
      if (error) {
        console.error(`Error deleting users: ${error.message}`);
      } else {
        console.log("Users deleted successfully");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error in afterAll", err.message);
      }
    }
  }, 10000);

  afterAll(async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .neq("created_at", "2000-05-19 12:05:07.784723+00");
      if (error) {
        console.error(`Error deleting users: ${error.message}`);
      } else {
        console.log("Users deleted successfully");
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error in afterAll", err.message);
      }
    }
  }, 10000);

  it("should create a new user successfully", async () => {
    const newUser = { username: "TestUser", email: "testuser@email.com" };

    const res = await request(app).post("/new").send(newUser);

    expect(res.status).toBe(200);

    const allUsers = await userController.findAll();

    const createdUser = allUsers![allUsers!.length - 1];

    expect(createdUser.username).toEqual(newUser.username);
    expect(createdUser.email).toEqual(newUser.email);
  }, 10000);

  it("finds a user by id", async () => {
    const user = { username: "test1", email: "test1@email.com" };
    const createdUser = await userController.create(user);
    expect(createdUser).not.toBeNull();

    const res = await request(app).get(`/id/${createdUser![0].id}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(user.username);
  });

  it("finds a user by username", async () => {
    const user = { username: "test2", email: "test2@email.com" };
    const createdUser = await userController.create(user);
    expect(createdUser).not.toBeNull();

    const res = await request(app).get(`/username/${createdUser![0].username}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(user.username);
    expect(res.body.email).toEqual(user.email);
  });

  it("finds a user by email", async () => {
    const user = { username: "test3", email: "test3@email.com" };
    const createdUser = await userController.create(user);
    expect(createdUser).not.toBeNull();

    const res = await request(app).get(`/email/${createdUser![0].email}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toEqual(user.username);
    expect(res.body.email).toEqual(user.email);
  });
  it("finds all users", async () => {
    const user1 = { username: "test4", email: "test4@email.com" };
    const user2 = { username: "test5", email: "test5@email.com" };
    const createdUser1 = await userController.create(user1);
    const createdUser2 = await userController.create(user2);

    const res = await request(app).get("/");

    expect(res.status).toBe(200);

    const users = res.body;
    expect(users.some((user: any) => user.id === createdUser1![0].id)).toBe(
      true
    );
    expect(users.some((user: any) => user.id === createdUser2![0].id)).toBe(
      true
    );
  });
});
