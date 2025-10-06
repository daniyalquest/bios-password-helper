const client = require("../../../lib/mongodb");

async function getDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
  return client.db("password-helper");
}

export async function GET() {
  const db = await getDB();
  const data = await db.collection("failed_guesses").find().toArray();
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();
  const db = await getDB();

  await db.collection("failed_guesses").insertOne({
    value: body.value,
    createdAt: new Date(),
  });

  return Response.json({ success: true });
}
