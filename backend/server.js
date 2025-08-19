const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

app.post("/api/users", async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const newUser = new User({ userId });
    await newUser.save();
    res.status(201).json({ message: "User saved successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});


const RoomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  players: [
    {
      playerName: { type: String, required: true },
      joinedAt: { type: Date, default: Date.now }
    }
  ]
});

const Room = mongoose.model("Room", RoomSchema);


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


app.get("/api/rooms", async (req, res) => {
  const rooms = await Room.find();
  res.json(rooms);
});


app.post("/api/rooms/join", (req, res) => {
  const { playerName, roomId } = req.body;
  if (!playerName || !roomId) {
    return res.status(400).json({ msg: "Player name and roomId required" });
  }

  return res.json({ success: true, playerName, roomId });
});


// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
