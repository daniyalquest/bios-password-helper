import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ MongoDB connected successfully!");
    await client.close();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

testConnection();
