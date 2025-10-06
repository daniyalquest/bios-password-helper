const { MongoClient, ServerApiVersion } = require("mongodb");

// Replace <db_password> with your real password
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
    const personal = db.collection("personal_info");

    const data = [
      { category: "phone", value: "923362287646" },
      { category: "phone", value: "923002287646" },
      { category: "phone", value: "923345491919" },
      { category: "phone", value: "923332287646" },
      { category: "dob", value: "24072002" },
      { category: "other", value: "283292" },
      { category: "other", value: "252432" },
      { category: "other", value: "225789" },
      { category: "other", value: "1313" },
      { category: "other", value: "1463563" },
    ];

    // Clear old data
    await personal.deleteMany({});
    // Insert fresh data
    await personal.insertMany(data);

    console.log("✅ personal_info seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
