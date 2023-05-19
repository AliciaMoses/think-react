import { SupabaseClient } from "@supabase/supabase-js";
import { UserController } from "./users";
import { User } from "../../models/user/user";

const expectedResult: User = {
  id: "1",
  username: "test",
  email: "test@email.com",
  created_at: "",
};

const mockSingle = jest.fn();
const mockEq = jest.fn(() => ({ single: mockSingle }));
const mockThen = jest.fn();
const mockSelect = jest.fn(() => ({ eq: mockEq, then: mockThen }));

const mockInsertSelect = jest
  .fn()
  .mockResolvedValue({ data: [expectedResult], error: null });
const mockInsert = jest.fn(() => ({ select: mockInsertSelect }));

const mockSupabase = {
  from: jest.fn(() => ({ select: mockSelect, insert: mockInsert, eq: mockEq })),
} as unknown as SupabaseClient;

describe("UserController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates a user successfully", async () => {
    const newUser: Omit<User, "id" | "created_at"> = {
      username: "test",
      email: "test@email.com",
    };

    mockInsertSelect.mockResolvedValue({ data: [expectedResult], error: null });

    const userController = UserController(mockSupabase);

    const result = await userController.create(newUser);
    if (result) {
      expect(result[0]).toEqual(expectedResult);
    } else {
      fail("Result is null");
    }

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockInsert).toHaveBeenCalledWith(newUser);
    expect(mockInsertSelect).toHaveBeenCalled();
  });

  it("finds a user by their id", async () => {
    const expectedId = "1";
    mockSingle.mockResolvedValue({ data: expectedResult, error: null });
    mockEq.mockReturnValue({ single: mockSingle });
    const userController = UserController(mockSupabase);
    const result = await userController.findById(expectedId);
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", expectedId);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
  it("finds a user by their username", async () => {
    const expectedUsername = "test";
    mockSingle.mockResolvedValue({ data: expectedResult, error: null });
    mockEq.mockReturnValue({ single: mockSingle });
    const userController = UserController(mockSupabase);
    const result = await userController.findByUsername(expectedUsername);
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("username", expectedUsername);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
  it("finds a user by their email address", async () => {
    const expectedEmail = "test@email.com";
    mockSingle.mockResolvedValue({ data: expectedResult, error: null });
    mockEq.mockReturnValue({ single: mockSingle });
    const userController = UserController(mockSupabase);
    const result = await userController.findByEmail(expectedEmail);
    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSelect).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("email", expectedEmail);
    expect(mockSingle).toHaveBeenCalled();
    expect(result).toEqual(expectedResult);
  });
  it("finds all users", async () => {
    const expectedUsers: User[] = [
      {
        id: "1",
        username: "test1",
        email: "test1@email.com",
        created_at: "",
      },
      {
        id: "2",
        username: "test2",
        email: "test2@email.com",
        created_at: "",
      },
    ];

    mockThen.mockResolvedValue({ data: expectedUsers, error: null });

    const userController = UserController(mockSupabase);

    const result = await userController.findAll();

    expect(mockSupabase.from).toHaveBeenCalledWith("users");
    expect(mockSelect).toHaveBeenCalled();
    expect(mockThen).toHaveBeenCalled();
    expect(result).toEqual(expectedUsers);
  });
});
