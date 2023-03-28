import express, { json, urlencoded } from "express";
import router from "./routes/index.js";
import logger from "./middleware/logger.js";
import { createRequire } from "module";
import verifytoken from "./middleware/verifytoken.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const app = express();
const cors = require("cors");
//init middleware
app.use(json());
app.use(logger);
app.use(cors());
app.use(urlencoded({ extended: false }));
app.post("/login", async (req, res) => {
  let { email } = req.body;
  if (email) {
    const user = await prisma.user.findFirst({
      where: { email, status: true },
    });
    if (user) {
    let updated=  await prisma.user.update({
        where: { id: user.id },
        data: { loginCount: { increment: 1 } },
      });
      jwt.sign(
        { email: user.email, id: user.id },
        "secretkey",
        { expiresIn: "1h" },
        (err, token) => {
          if (err) {
            return res.json("Error:", err);
          }
          return res.json({ token, updated });
        }
      );
    } else {
      return res.json({ email, msg: `No Active User Found` });
    }
  } else {
    return res.json({ email, msg: `Email is required` });
  }
});
app.post("/Signup", async (req, res) => {
  let { email, name } = req.body;
  if (email && name) {
    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          status: true,
          loginCount: 0,
        },
      });
      return res
        .status(201)
        .json({ success: true, message: "User Created", user });
    } catch (error) {
      return res.status(403).json({
        success: false,
        message: "User Creation failed , Email already exist",
        error,
      });
    }
  } else {
    return res.json({ email, msg: `Email and Name are required` });
  }
});

// app.use(Static(join(__dirname, 'public')))
//all routes
app.use("/api", verifytoken, router);
const PORT = process.env.PORT;
app.listen(PORT);
