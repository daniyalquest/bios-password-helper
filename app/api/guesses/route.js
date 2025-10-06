import clientPromise from "@/lib/mongodb";

// Helper: generate smarter consecutive-based suggestions
function generateSuggestions(guesses, personalInfos) {
  const guessValues = guesses.map((g) => String(g.value || "").trim());
  const personalValues = personalInfos.map((p) => String(p.value || "").trim());

  const found = new Set();

  for (const guess of guessValues) {
    if (!/^\d+$/.test(guess)) continue; // Skip non-numeric
    for (const info of personalValues) {
      if (!/^\d+$/.test(info)) continue;

      const index = info.indexOf(guess);
      if (index !== -1) {
        const before = info.slice(Math.max(0, index - 4), index);
        const after = info.slice(index + guess.length, index + guess.length + 4);

        // Core patterns based on consecutive grouping
        const variants = [];
        if (after) variants.push(guess + after);     // Append next digits
        if (before) variants.push(before + guess);   // Prepend previous digits
        if (before && after) variants.push(before + guess + after);

        for (const v of variants) {
          if (/^\d{4,8}$/.test(v) && !guessValues.includes(v)) {
            found.add(v);
          }
        }
      }
    }
  }

  // Group by length, ensure 3 per group (4–8 digits)
  const result = {};
  for (let len = 4; len <= 8; len++) {
    const matches = Array.from(found).filter((s) => s.length === len);
    const unique = [...new Set(matches)];

    // Fallback: try random slices from personal info
    while (unique.length < 3) {
      const randomInfo = personalValues[Math.floor(Math.random() * personalValues.length)] || "";
      if (randomInfo.length >= len) {
        const start = Math.floor(Math.random() * (randomInfo.length - len));
        const segment = randomInfo.slice(start, start + len);
        if (/^\d+$/.test(segment) && !guessValues.includes(segment)) {
          unique.push(segment);
        }
      } else break;
    }

    result[len] = unique.slice(0, 3);
  }

  return result;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("password-helper");

    const guesses = await db.collection("guesses").find({}).toArray();
    const personalInfos = await db.collection("personal_info").find({}).toArray();

    const suggestions = generateSuggestions(guesses, personalInfos);

    return Response.json({ guesses, suggestions });
  } catch (error) {
    console.error("❌ GET /api/guesses error:", error);
    return Response.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("password-helper");
    const body = await req.json();

    if (!body.value || !/^\d+$/.test(body.value)) {
      return Response.json({ error: "Invalid input — only digits allowed" }, { status: 400 });
    }

    await db.collection("guesses").insertOne({ value: body.value });
    return Response.json({ success: true });
  } catch (error) {
    console.error("❌ POST /api/guesses error:", error);
    return Response.json({ error: "Failed to insert guess" }, { status: 500 });
  }
}
