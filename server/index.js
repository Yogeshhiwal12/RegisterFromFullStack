
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();



const PORT = process.env.PORT || 5000;
const MONGO_URI =
  "mongodb+srv://yk31360:yogi@cluster0.wtwxvq8.mongodb.net/registerForm?retryWrites=true&w=majority"; // Replace with your MongoDB connection string

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  state: String,
  city: String,
});

const UserModel = mongoose.model("User", userSchema);

app.get("/api/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/api/users", async (req, res) => {
  const { name, email, state, city } = req.body;

  // Simple validation for name and email fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const newUser = new UserModel({ name, email, state, city });
    await newUser.save();
    res.json({ message: "User saved successfully" });
  } catch (error) {
    console.error("Error saving user: ", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

app.put("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { name, email, state, city } = req.body;

  // Simple validation for name and email fields
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, email, state, city },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user: ", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

app.delete("/api/users/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    await UserModel.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user: ", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
