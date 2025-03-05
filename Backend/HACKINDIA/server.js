require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // For parsing JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
    email: String,
    password: String, // (Use bcrypt to hash passwords in production)
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// Sign Up Route
app.post("/signup", async (req, res) => {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ email, password });
    await newUser.save();

    res.json({ message: "User registered successfully!" });
});

// Login Route
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({ message: "Login successful!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
