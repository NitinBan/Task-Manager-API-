const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth.js");

const router = new express.Router();

// creating a route to get request for tasks
router.post("/tasks", auth, async (req, res) => {
  const task = new Task({
    ...req.body, // ES6 way of copy all the properties of object to this object
    owner: req.user.id,
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc

//setup route to read task
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  //filter for completed task is provided in query
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(":");
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
  }

  try {
    //getting tasks by userID from Task
    //const tasks = await Task.find({ owner: req.user._id });
    //res.send(tasks);

    //OR

    //getting all the tasks of the user from User
    await req.user
      //this object is usesd to filter data
      .populate({
        //name of the path
        path: "tasks",
        //an object which contain filter condition
        match,
        //options is an object which is used for pagination and sorting
        options: {
          limit: parseInt(req.query.limit), //limit is used to limit the result to limited number
          skip: parseInt(req.query.skip), //skip is used to skip the result as per number provided
          //'1' for ascending and '-1' for descending
          sort,
        },
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

//setup route to read single task
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const task = await Task.findOne({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send();
  }
});

//setup route to update the task
router.patch("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(404).send("invalid update");
  }
  try {
    const task = await Task.findByIdAndUpdate({ _id, owner: req.user._id });

    if (!task) {
      return res.status(404).send("unable to update");
    }

    updates.forEach((update) => {
      task[update] = req.body[update];
    });

    await task.save();
    res.send(task);
  } catch (e) {
    res.status(505).send(e);
  }
});

//setup route to delete the task
router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(400).send("unable to delete");
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
