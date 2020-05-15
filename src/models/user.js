const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

//as second operator we pass an object to model()
//behind the scenes object is called schema
//in order to encrypt user password before saving,
//we have create a new schema and pass is to the mode.

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("age must be a positive number");
        }
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("invalid email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error("can't have 'password' as password");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

//virtual function is used to define a virtual property,
//it won't get stored in database
//it is used to create relation with another model

userSchema.virtual("tasks", {
  ref: "Tasks", //setup relation with another model i.e. Task
  //the fields of both models which are used for relation:-
  localField: "_id", // the field of local model i.e. User
  foreignField: "owner", // the field of other model i.e. Task
});

//function to return just necessary info to user
//i.e. hiding the password and tokens array.
//toJSON method doesn't need to be called
//behind the scenes the express calls JSON.stringify() whenever res.send() is called
//so on user instance we created toJSON() which will called implicitly
// whenever express calls JSON.stringify().
//this method can reuturn object as we want to
//eg. sending it as it is or sending a modified object like below.

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;

  return userObject;
};

//methods methods are accessible on instances and called as instance methods
//function to generate token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET);

  user.tokens = user.tokens.concat({ token });

  await user.save();

  return token;
};

//function for login authentication
//statics methods are accessible on models and called as model methods
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("unable to login");
  }

  return user;
};

//this code will hash password before saving the user
//next() is used to stop the function,
//without it the code will keep runnnig bcs it doesn't when to stop

userSchema.pre("save", async function (next) {
  const user = this;

  //to check weather password is created(while creating a user)
  //and to check weather password is modifieed(while updating a user)

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

//delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model("User", userSchema);

//exporting
module.exports = User;
