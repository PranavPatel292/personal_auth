const express = require("express");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");

let refreshTokenMap = {};

app.use(express.json());

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;

  if (refreshToken === null) return res.status(401);
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlByYW5hdiIsImlhdCI6MTY2NzA4MjcxM30.ZHfbemPabv2h5gW3blsusESyiPlGNPnirLPIsSfo7PE
  if (
    !refreshTokenMap[refreshToken] ||
    refreshTokenMap[refreshToken] === undefined
  )
    return res.status(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403);

    const accessToken = getAccessToken({ userName: user.userName });
    return res.json({ accessToken: accessToken });
  });
});

app.post("/login", (req, res) => {
  // Authenticate users by using database
  const userName = req.body.userName;
  const user = { userName: userName };
  const accessToken = getAccessToken(user);
  const refreshToken = getRefreshToken(user);
  refreshTokenMap[refreshToken] = true;
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlByYW5hdiIsImlhdCI6MTY2NzA4Mjg5Nn0.nydccdmSVRwxrGG8ocQWqSgpFDMJ1Ud012ii2wVUIJ8
app.delete("/logout", (req, res) => {
  const refreshToken = req.body.token;
  delete refreshTokenMap.refreshToken;
  return res.status(204);
});

const getAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
};

const getRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};
app.listen(4000);
