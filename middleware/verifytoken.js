import { createRequire } from "module";
const require = createRequire(import.meta.url);
const jwt = require("jsonwebtoken");
const verifytoken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (typeof token !== "undefined") {
    jwt.verify(token, "secretkey", (err, user) => {
      if (err) {
        return res
          .status(403)
          .send({
            statusCode: 403,
            message: "User session Expired",
          })
          .end();
      } else {
        req.body.authData = user;
        next();
      }
    });

    // res.json(payload)
  } else {
    return res
      .status(401)
      .send({
        success: false,
        statusCode: 401,
        message: "Unauthorized",
      })
      .end();
  }
};

export default verifytoken;
