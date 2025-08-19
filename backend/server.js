const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Models
const User = require("./models/user");
const Room = require("./models/Room");

// -------------------- USER ROUTES --------------------

// Register User
app.post("/api/users/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "username, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already in use" });

    const newUser = new User({ username, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "✅ User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login User
app.post("/api/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({ message: "✅ Login successful", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Users
app.get("/api/users", async (req, res) => {
  const users = await User.find().select("-password"); // don’t expose password
  res.json(users);
});

// -------------------- ROOM ROUTES --------------------

// Join/Create Room
app.post("/api/rooms/join", async (req, res) => {
  try {
    const { roomId, playerName } = req.body;
    if (!roomId || !playerName) {
      return res.status(400).json({ error: "roomId and playerName are required" });
    }

    let room = await Room.findOne({ roomId });

    if (room) {
      room.players.push({ playerName });
      await room.save();
      return res.json({ message: "Joined existing room", room });
    } else {
      const newRoom = new Room({
        roomId,
        players: [{ playerName }]
      });
      await newRoom.save();
      return res.status(201).json({ message: "Created new room and joined", room: newRoom });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Rooms
app.get("/api/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});

// -------------------- SERVER --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
