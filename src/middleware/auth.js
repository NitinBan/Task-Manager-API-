const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "please authenticate" });
  }
};
module.exports = auth;

/* -- tutorial -- */

//
//without middleware:    new request -->  run route handler
//
//with middleware:  new request --> do something --> eun route handler

// //middleware function to enable authentication
// app.use((req, res, next) => {
//   if (req.method === "GET") {
//     res.send("GET request are disable");
//   } else {
//     //it is used to stop middleware and call next functions
//     next();
//   }
// });
