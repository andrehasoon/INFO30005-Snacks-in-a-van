require('dotenv').config()
const mongoose = require("mongoose")

// Connect to MongoDB -database login is retrieved from environment variables

CONNECTION_STRING = "mongodb+srv://<username>:<password>@cluster0.i6r42.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"


MONGO_URL = CONNECTION_STRING.replace("<username>",process.env.MONGO_USERNAME).replace("<password>",process.env.MONGO_PASSWORD)



console.log(MONGO_URL)

mongoose.connect(MONGO_URL || "mongodb://localhost", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  dbName: "snacksinavan"
})

const db = mongoose.connection

db.on("error", err => {
  console.error(err);
  process.exit(1)
})

db.once("open", async () => {
  console.log("Mongo connection started on " + db.host + ":" + db.port)
})

require("./order")
require("./vendor")
require("./snack")
require("./customer")
