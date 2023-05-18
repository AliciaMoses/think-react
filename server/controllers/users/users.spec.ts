import { SupabaseClient } from "@supabase/supabase-js";
import { UserController } from "./users";
import { User } from "../../models/user/user";

const mockQuery = {
  insert: jest.fn().mockReturnThis(),
  single: jest.fn(),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  delete: jest.fn(),
  then: jest.fn(),
};

const mockSupabase = {
  from: jest.fn(() => mockQuery),
} as unknown as SupabaseClient;

describe("UserController", () => {
  it("creates a user successfully", async () => {
    const newUser: Omit<User, "id"> = {
      username: "test",
      email: "test@email.com",
    };

    const expectedResult: User = {
      id: "1",
      username: "test",
      email: "test@email.com",
    };

    mockQuery.single.mockResolvedValue({ data: expectedResult, error: null });

    const userController = UserController(mockSupabase);

    const result = await userController.create(newUser);

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockQuery.insert).toHaveBeenCalledWith(newUser);
    expect(mockQuery.single).toHaveBeenCalled();

    expect(result).toEqual(expectedResult);
  });
  it("finds a user by ID", async () => {
    const expectedUser: User = {
      id: "1",
      username: "test",
      email: "test@email.com",
    };
    mockQuery.single.mockResolvedValue({ data: expectedUser, error: null });
    const userController = UserController(mockSupabase);
    const result = await userController.findById("1");
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockQuery.select).toHaveBeenCalledWith("*");
    expect(mockQuery.eq).toHaveBeenCalledWith("id", "1");
    expect(mockQuery.single).toHaveBeenCalled();

    expect(result).toEqual(expectedUser);
  });
  it("finds a user by username", async () => {
    const expectedUser: User = {
      id: "1",
      username: "test",
      email: "test@email.com",
    };

    mockQuery.single.mockResolvedValue({ data: expectedUser, error: null });
    const userController = UserController(mockSupabase);
    const result = await userController.findByUsername("test");
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockQuery.select).toHaveBeenCalledWith("*");
    expect(mockQuery.eq).toHaveBeenCalledWith("username", "test");
    expect(mockQuery.single).toHaveBeenCalled();
    expect(result).toEqual(expectedUser);
  });
  it("finds a user by email", async () => {
    const expectedUser: User = {
      id: "1",
      username: "test",
      email: "test@email.com",
    };

    mockQuery.single.mockResolvedValue({ data: expectedUser, error: null });

    const userController = UserController(mockSupabase);

    const result = await userController.findByEmail("test@email.com");

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockQuery.select).toHaveBeenCalledWith("*");
    expect(mockQuery.eq).toHaveBeenCalledWith("email", "test@email.com");
    expect(mockQuery.single).toHaveBeenCalled();
    expect(result).toEqual(expectedUser);
  });
  it("gets all users successfully", async () => {
    const expectedUsers: User[] = [
      {
        id: "1",
        username: "test",
        email: "test@email.com",
      },
    ];

    mockQuery.then.mockResolvedValue({ data: expectedUsers, error: null });

    const userController = UserController(mockSupabase);

    const result = await userController.findAll();

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockQuery.select).toHaveBeenCalledWith("*");
    expect(result).toEqual(expectedUsers);
  });
});
