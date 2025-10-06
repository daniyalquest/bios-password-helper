import clientPromise from "@/lib/mongodb";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("password-helper");
        const personals = await db.collection("personal").find({}).toArray();

        return Response.json(personals);
    } catch (error) {
        console.error("Error in /api/personal:", error);
        return Response.json({ error: "Failed to fetch personal passwords" }, { status: 500 });
    }
}
