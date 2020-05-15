const express = require("express");

//connecting mongoose file to connect to the database
require("./db/mongoose");

const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());

//registering user router
app.use(taskRouter);
app.use(userRouter);

//this is used to parse the json data we are getting from the http request

app.listen(port, () => {
  console.log("server is up and running on port: " + port);
});
