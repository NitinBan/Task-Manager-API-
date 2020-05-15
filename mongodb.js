// // CRUD - create read update delete

// const mongodb = require("mongodb"); //it will return an object

// //to initialise the connection
// //MongoClient will provide access function to perform CRUD operations
// const MongoClient = mongodb.MongoClient;

// //it is used to generate our own object id
// const ObjectID = mongodb.ObjectID;

// //mongodb localhost url
// const connectionURL = "mongodb://127.0.0.1:27017";

// //database name
// const databaseName = "task-manager";

// //connect() takes 3 arguement  [it is asynchronous process]
// //1. the connection URL
// //2. optional object arguement which take property to parse json file
// //3.callback function , which will called when actually connect to database.

// MongoClient.connect(
//   connectionURL,
//   { useNewUrlParser: true, useUnifiedTopology: true },
//   (error, client) => {
//     if (error) {
//       return console.log(error);
//     }

//     //it will return a database reference which can use to manipulate data
//     const db = client.db(databaseName);

//     // db.collection("users")
//     //   .deleteMany({ age: 24 })
//     //   .then((result) => {
//     //     console.log(result);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });

//     // db.collection("tasks")
//     //   .deleteOne({
//     //     describe: "task 1",
//     //   })
//     //   .then((result) => {
//     //     console.log(result);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });

//     // db.collection("tasks")
//     //   .updateMany(
//     //     {
//     //       status: "incomplete",
//     //     },
//     //     {
//     //       $set: {
//     //         status: "complete",
//     //       },
//     //     }
//     //   )
//     //   .then((result) => {
//     //     console.log(result.modifiedCount);
//     //   })
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });

//     // db.collection("users")
//     // //to update the data
//     //   .updateOne(
//     //     { _id: new ObjectID("5eba97f929decc09c8acb0df") }, //an object for filters
//     //     {
//     //       //an object to update value
//     //       $set: {
//     //         name: "Shiv",
//     //       },
//     //     }
//     //   )
//     //   //function to call when things go well
//     //   .then((result) => {
//     //     console.log(result);
//     //   })
//     //   //function to call when things doesn't go well
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });

//     // db.collection("users")
//     //   //to update the data
//     //   .updateOne(
//     //     { _id: new ObjectID("5eba97f929decc09c8acb0df") }, //an object for filters
//     //     {
//     //       //an object to update value
//     //       $inc: {
//     //         age: 1, //increment age by one
//     //       },
//     //     }
//     //   )
//     //   //function to call when things go well
//     //   .then((result) => {
//     //     console.log(result);
//     //   })
//     //   //function to call when things doesn't go well
//     //   .catch((error) => {
//     //     console.log(error);
//     //   });

//     //findOne() takes 2 arguements [it will return the first match found]
//     //1.an object which specify the filter for finding
//     //2.callback function which run when result comes

//     // db.collection("users").findOne(
//     //   { _id: ObjectID("5eba9bd34fd5252b18b3daf0") },
//     //   (error, user) => {
//     //     if (error) {
//     //       return console.log("unable to fetch");
//     //     }
//     //     console.log(user);
//     //   }
//     // );

//     //find() returns a cusror i.e. a pointer to the matched data in database
//     //the returned cursor has many methods and one of them is toArray()
//     //toArray returns in callback function the actual matched data
//     // db.collection("users")
//     //   .find({ age: 23 })
//     //   .toArray((error, users) => {
//     //     if (error) {
//     //       return console.log("unable to fetch");
//     //     }
//     //     console.log(users);
//     //   });

//     //count()
//     // db.collection("users")
//     //   .find({ age: 23 })
//     //   .count((error, users) => {
//     //     if (error) {
//     //       return console.log("unable to fetch");
//     //     }
//     //     console.log(users);
//     //   });

//     // db.collection("tasks").findOne(
//     //   { _id: new ObjectID("5c0fec243ef6bdfbe1d62e2f") },
//     //   (error, task) => {
//     //     console.log(task);
//     //   }
//     // );

//     // db.collection("tasks")
//     //   .find({ completed: false })
//     //   .toArray((error, tasks) => {
//     //     console.log(tasks);
//     //   });

//     // db.collection("tasks").insertMany(
//     //   [
//     //     {
//     //       describe: "task 1",
//     //       status: "incomplete",
//     //     },
//     //     {
//     //       describe: "task 2",
//     //       status: "complete",
//     //     },
//     //     {
//     //       describe: "task 3",
//     //       status: "incomplete",
//     //     },
//     //   ],
//     //   (error, result) => {
//     //     if (error) {
//     //       console.log("unable to insert tasks");
//     //     }

//     //     console.log(result.ops);
//     //   }
//     // );

//     // db.collection("users").insertMany(
//     //   [
//     //     {
//     //       name: "paras",
//     //       age: 23,
//     //     },
//     //     {
//     //       name: "shubham",
//     //       age: 24,
//     //     },
//     //   ],
//     //   (error, result) => {
//     //     if (error) {
//     //       return console.log("unable to insert in users");
//     //     }

//     //     console.log(result.ops);
//     //   }
//     // );

//     //collection() is used to get/create a collection and takes collection name as arguement
//     //insertOne() is used enter one document in collection as an object as arguement
//     // db.collection("users").insertOne(
//     //   {
//     //     _id: id,
//     //     name: "sikha",
//     //     age: 26,
//     //   },
//     //   (error, result) => {
//     //     if (error) {
//     //       return console.log("unable to insert user");
//     //     }

//     //     //result.ops retuns an array of documents that we inserted
//     //     console.log(result.ops);
//     //   }
//     // );
//   }
// );

// /* -- tutorials -- */

// // ObjectID

// // Returns a new ObjectId value. The 12-byte ObjectId value consists of:
// // a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
// // a 5-byte random value
// // a 3-byte incrementing counter, initialized to a random value
// // const id = new ObjectID();

// // // console.log(id.id);

// // console.log(id.toHexString().length);

// //getTimestamp() method is used to get the time when the object id was created.
// // console.log(id.getTimestamp());
