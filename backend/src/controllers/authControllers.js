const customerModel = require("../models/customerModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  const { name, email, password, phone, accountType, shopName } = req.body;

  // Input validation
  if (!name || !name.trim()) return res.status(400).json({ message: "Name is required." });
  if (!email || !email.trim()) return res.status(400).json({ message: "Email is required." });
  if (!password || password.length < 8) return res.status(400).json({ message: "Password must be at least 8 characters." });
  if (!phone) return res.status(400).json({ message: "Phone number is required." });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return res.status(400).json({ message: "Invalid email address." });

  try {
    const existing = await userModel.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(400).json({ message: "An account with this email already exists." });

    const existingPhone = await userModel.findOne({ phone });
    if (existingPhone) return res.status(400).json({ message: "An account with this phone number already exists." });

    const customer = await customerModel.create({ name: name.trim(), phone });
    await userModel.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone,
      userId: customer._id,
      accountType: accountType || "shopkeeper",
      shopName: shopName?.trim() || "",
    });
    res.status(201).json({ message: "Account created successfully. Please sign in." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await userModel.findOne(
      { email: email.trim().toLowerCase() },
      { email: 1, password: 1, userId: 1, accountType: 1 }
    );
    if (!user) return res.status(400).json({ message: "No account found with this email." });
    if (user.password !== password) return res.status(400).json({ message: "Incorrect password. Please try again." });

    const token = jwt.sign(
      { userId: user.userId, myId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(200).json({ token, accountType: user.accountType, message: "Signed in successfully." });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

module.exports = { signup, signin };
