const express = require("express");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");

app.use(express.json());
const posts = [
  {
    userName: "Pranav",
    title: "Post 1",
  },
  {
    userName: "Test",
    title: "Post 2",
  },
];

const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get("/posts", authToken, (req, res) => {
  res.json(posts.filter((post) => post.userName === req.user.userName));
});

app.listen(3000);
