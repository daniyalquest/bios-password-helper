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

async function run() {
  try {
    await client.connect();

    const db = client.db("password-helper");
    const guesses = db.collection("failed_guesses");

    await guesses.deleteMany({});
    await guesses.insertOne({ value: "0000", createdAt: new Date() });

    console.log("✅ failed_guesses seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
