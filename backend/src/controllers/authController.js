const { userService } = require("../services");
const { AppError } = require("../utils/errors");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.register({
      name,
      email,
      password,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(201).json({ status: "success", data: { user, accessToken } });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.login({
      email,
      password,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: process.env.NODE_ENV === "production", // Use Secure in production
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ status: "success", data: { user, accessToken } });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError("Refresh token not provided", 401);
    }
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await userService.refreshToken(refreshToken);
    
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ status: "success", data: { user, accessToken } });
  } catch (error) {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    res.status(statusCode).json({ status: "error", message: error.message });
  }
};
