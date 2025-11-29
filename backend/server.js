// server.js
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
 connectDB(); 


// Initialize express app
const app = express();


// Middleware
app.use(cors());
app.use(express.json()); // For parsing JSON request bodies

// Default route
app.get("/", (req, res) => {
  res.send("API is running... sarthak");
});
 
// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status : "Ok",
    message : "api is working properly"
  });

});

app.use('/api/auth',authRoutes);
app.use('/api/blogs',blogRoutes);



// PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
