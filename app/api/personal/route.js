import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("password-helper");
    const personalInfo = await db.collection("personalInfo").find({}).toArray();
    return Response.json(personalInfo);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }
}
