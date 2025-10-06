import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bios-helper");
    const passwords = await db.collection("passwords").find().toArray();
    return NextResponse.json(passwords);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { value, notes } = await req.json();
    const client = await clientPromise;
    const db = client.db("bios-helper");

    const result = await db.collection("passwords").insertOne({
      value,
      notes,
      createdAt: new Date()
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
