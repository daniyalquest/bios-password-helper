const client = require("../../../lib/mongodb");

async function getDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("password-helper");
}

export async function GET() {
  const db = await getDB();
  const data = await db.collection("personal_info").find().toArray();
  return Response.json(data);
}
