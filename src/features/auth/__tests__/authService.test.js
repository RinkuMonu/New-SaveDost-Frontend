import authService from "../services/authService";
import apiClient from "../../../services/apiClient";

jest.mock("../../../services/apiClient");

describe("Authentication & Session Service Tests (Prompt 11)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("login with mobile and password constructs correct payload", async () => {
    const mockResponse = {
      statusCode: 200,
      data: {
        accessToken: "test_token_123",
        user: { _id: "u1", name: "Test User", role: "USER", mobile: "9876543210" },
      },
      message: "Login successful",
    };

    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.login({
      mobile: "9876543210",
      password: "SecretPassword123",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
      mobile: "9876543210",
      mobileNumber: "9876543210",
      password: "SecretPassword123",
    });
    expect(result).toEqual(mockResponse);
  });

  test("login with OTP constructs correct payload", async () => {
    const mockResponse = {
      statusCode: 200,
      data: {
        accessToken: "test_token_otp",
        user: { _id: "u2", role: "API_PARTNER", mobile: "9876543211" },
      },
    };

    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.login({
      mobile: "9876543211",
      otp: "123456",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
      mobile: "9876543211",
      mobileNumber: "9876543211",
      otp: "123456",
    });
    expect(result).toEqual(mockResponse);
  });

  test("register formats names and automatically adds terms and business fields", async () => {
    const mockResponse = {
      statusCode: 201,
      data: { _id: "u3", name: "Rahul Sharma", role: "USER" },
      message: "Registration successful",
    };

    apiClient.post.mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.register({
      name: "Rahul Sharma",
      mobile: "9876543212",
      email: "Rahul@Example.Com",
      password: "Pass@123",
    });

    expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
      name: "Rahul Sharma",
      firstName: "Rahul",
      lastName: "Sharma",
      companyName: "Rahul Sharma Services",
      businessName: "Rahul Sharma Services",
      mobile: "9876543212",
      mobileNumber: "9876543212",
      email: "rahul@example.com",
      password: "Pass@123",
      confirmPassword: "Pass@123",
      termsAccepted: true,
      isTermsAccepted: true,
    });
    expect(result).toEqual(mockResponse);
  });

  test("sendOtp and verifyOtp format payloads correctly", async () => {
    apiClient.post.mockResolvedValueOnce({ data: { statusCode: 200, message: "OTP sent" } });
    const sendResult = await authService.sendOtp("9876543210");
    expect(apiClient.post).toHaveBeenCalledWith("/auth/send-otp", {
      mobile: "9876543210",
      mobileNumber: "9876543210",
    });
    expect(sendResult.message).toBe("OTP sent");

    apiClient.post.mockResolvedValueOnce({ data: { statusCode: 200, message: "OTP verified" } });
    const verifyResult = await authService.verifyOtp("9876543210", "654321");
    expect(apiClient.post).toHaveBeenCalledWith("/auth/verify-otp", {
      mobile: "9876543210",
      mobileNumber: "9876543210",
      otp: "654321",
    });
    expect(verifyResult.message).toBe("OTP verified");
  });

  test("getCurrentUser dispatches GET /auth/me", async () => {
    const mockResponse = {
      statusCode: 200,
      data: { _id: "u1", name: "Admin", role: "ADMIN" },
    };

    apiClient.get.mockResolvedValueOnce({ data: mockResponse });

    const result = await authService.getCurrentUser();
    expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
    expect(result).toEqual(mockResponse);
  });

  test("logout handles both normal completion and network fallback gracefully", async () => {
    apiClient.post.mockResolvedValueOnce({ data: { success: true } });
    const res1 = await authService.logout();
    expect(res1.success).toBe(true);

    // Network error test
    apiClient.post.mockRejectedValueOnce(new Error("Network Error"));
    const res2 = await authService.logout();
    expect(res2.success).toBe(true);
    expect(res2.message).toBe("Logged out locally");
  });

  test("handles API errors properly when request rejects", async () => {
    apiClient.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: "Invalid credentials" } },
    });

    await expect(
      authService.login({ mobile: "9876543210", password: "wrong" })
    ).rejects.toMatchObject({
      response: { status: 401 },
    });
  });
});
