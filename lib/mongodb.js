const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://DaniAdmin:Daniyal1313@cluster0.lxsskk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

module.exports = client;
