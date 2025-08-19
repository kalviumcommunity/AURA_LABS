import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, authMethod = "local" } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // For local auth, password is required
    if (authMethod === "local" && !password) {
      return res.status(400).json({ error: "Password is required for local authentication" });
    }

    // For local auth, validate password length
    if (authMethod === "local" && password && password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    let hashedPassword = null;
    if (authMethod === "local" && password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      authMethod
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password, authMethod = "local" } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check if auth method matches
    if (user.authMethod !== authMethod) {
      return res.status(400).json({ 
        error: `This account uses ${user.authMethod} authentication. Please use the correct login method.` 
      });
    }

    // For local auth, validate password
    if (authMethod === "local") {
      if (!password) {
        return res.status(400).json({ error: "Password is required for local authentication" });
      }
      
      if (!user.password) {
        return res.status(400).json({ error: "This account doesn't have a password set" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// OAuth Signup/Login (for Firebase/Google)
export const oauthAuth = async (req, res) => {
  try {
    const { name, email, authMethod = "google" } = req.body;

    if (authMethod !== "google") {
      return res.status(400).json({ error: "Invalid OAuth method" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, check if they can use OAuth
      if (user.authMethod !== "google") {
        return res.status(400).json({ 
          error: "This email is already registered with local authentication. Please use password login." 
        });
      }
    } else {
      // Create new OAuth user
      user = new User({
        name,
        email,
        authMethod: "google"
      });
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: user.createdAt === user.updatedAt ? "OAuth user created successfully" : "OAuth login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        authMethod: user.authMethod,
        createdAt: user.createdAt
      },
      token
    });
  } catch (error) {
    console.error("OAuth auth error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
