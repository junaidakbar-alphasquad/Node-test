import express, { json, urlencoded } from "express";
import router from "./routes/index.js";
import logger from "./middleware/logger.js";
import { createRequire } from "module";
import verifytoken from "./middleware/verifytoken.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const app = express(),
  bodyParser = require("body-parser"),
  swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");
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
      let updated = await prisma.user.update({
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
          return res.json({ token, user: updated });
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
const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Test Express API with Swagger by Junaid",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "LogRocket",
        url: "https://logrocket.com",
        email: "info@email.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.use("/api", verifytoken, router);
const PORT = process.env.PORT;
app.listen(PORT);
