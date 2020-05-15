const express = require("express");
const User = require("../models/user");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
//const { sendWelcomeEmail, sendCancelEmail } = require("../emails/account");

const router = new express.Router();

// creating a route to get request for users with async-await
router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    //sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

// creating a route to get request for users without async-await
// router.post("/users", (req, res) => {
//   const user = new User(req.body);
//   user
//     .save()
//     .then(() => {
//       res.status(201).send(user);
//     })
//     .catch((e) => {
//       res.status(400).send(e);
//     });
// });

//setup to setup login route
router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.send({
      user, //: user.getPublicProfile(),
      token: token,
    });
  } catch (e) {
    res.status(400).send();
  }
});

//setup router to logout user from one device
//deleting the auth token form tokens of user.
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//setup router to logout user from all devices
//deleting all auth token form tokens of user.
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

// setup route to  read user from database
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

//setup route to update the user
router.patch("/users/me", auth, async (req, res) => {
  //return an array of keys in the object
  const updates = Object.keys(req.body);

  //an array which store which properties are valid to update
  const allowedUpdates = ["name", "email", "password", "age"];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("invalid updates");
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//setup route to delete the user
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    //sendCancelEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

//uploading file
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error("upload correct photo type"));
    }
    cb(undefined, true);
  },
});

//setup route to upload avatar for user.
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    //req.file.buffer contain the file in buffer form i.e. binary form to save in database
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();

    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  }, //this below function runs when there is any error
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//setup route to delete the avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

//setup route to get image
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send();
  }
});

module.exports = router;
