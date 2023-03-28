import { PrismaClient } from "@prisma/client";
import moment from "moment";
import jsonwebtoken from "jsonwebtoken";
const prisma = new PrismaClient();
const logger = async (req, res, next) => {
  let id;
  try {
    if (req.headers.authorization) {
      id = jsonwebtoken.decode(req.headers.authorization).id;
    }
    await prisma.logger.create({
      data: {
        user_id: id,
        body:
          req.protocol +
          ":" +
          req.get("host") +
          req.originalUrl +
          `(Method:${req.method})`,
        timestamp: moment().format(),
      },
    });
  } catch (error) {}
  next();
};

export default logger;
