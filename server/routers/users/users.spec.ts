import dotenv from 'dotenv';
import request from 'supertest';
import express from 'express';
import { userRouter } from './users';
import { UserController } from '../../controllers/users/users';
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl = process.env.TEST_SUPABASE_URL;
const supabaseAnonKey = process.env.TEST_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

const app = express();
app.use(express.json());

app.use(userRouter(supabase));

const userController = UserController(supabase);



describe('User Router', () => {
  beforeAll(async () => {
      try {
          const { data, error } = await supabase.from('users').delete().neq('created_at', '2000-05-19 12:05:07.784723+00'); 
          if (error) {
              console.error(`Error deleting users: ${error.message}`);
          } else {
              console.log('Users deleted successfully');
          }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error in afterAll', err.message);
        }}
  }, 10000);

  afterAll(async () => {
      try {
          const { data, error } = await supabase.from('users').delete().neq('created_at', '2000-05-19 12:05:07.784723+00'); 
          if (error) {
              console.error(`Error deleting users: ${error.message}`);
          } else {
              console.log('Users deleted successfully');
          }
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error in afterAll', err.message);
        }}
  }, 10000);

  it('should create a new user successfully', async () => {
    const newUser = {username: 'TestUser', email: 'testuser@email.com'}; 

    const res = await request(app)
      .post('/users')
      .send(newUser);

    expect(res.status).toBe(200);

    const allUsers = await userController.findAll();

    const createdUser = allUsers![allUsers!.length - 1];

    expect(createdUser.username).toEqual(newUser.username);
    expect(createdUser.email).toEqual(newUser.email)
}, 10000);

});
