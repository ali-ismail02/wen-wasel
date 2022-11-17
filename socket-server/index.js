const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const router = express.Router();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.get("/", function (req, res) {
    res.send("About this wiki");
});

io.on("connection", (socket) => {
    socket.on("location", (data) => {
        socket.broadcast.emit("locationBroadcast", data);
    });
});

server.listen(5000,"192.168.1.50", () => {
  console.log("SERVER IS RUNNING");
});