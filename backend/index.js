const express = require('express');
require("dotenv").config({ path: "./backend/.env" });
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const connectDB = require('./dataBase/db.js');
const authRoutes = require('./Routes/auth.route.js');

const app = express();

// port
const PORT = process.env.PORT || 5000;

// middleware...
app.use(express.json());
app.use(cookieParser());

// manage cors...
app.use(cors({
    origin: ["http://localhost:5173"], // Allow frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true // Allow cookies & authorization headers
}));

// router..
app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "/frontend", "dist", "index.html"));
    });
}

app.get('/', (req, res) => {
    res.send("hello");
});

app.listen(PORT, () => {
    connectDB();
    console.log("server is running on:", PORT);
});
