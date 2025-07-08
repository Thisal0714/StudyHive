import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("Authorization");
  if (auth !== `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "No email provided" }, { status: 400 });
  }

  // ✅ Dummy notes — replace with DB logic later   menna meka thm krnna oni, meka poddk ahpn gpt eken
  

  // Menna methana thyn data tikt response eken ena tika map krnna oni
  const dummyNotes = [
    { filename: "Test1.pdf", contentType: "application/pdf" },
    { filename: "Thisal_Chamodya_CV.pdf", contentType: "application/pdf" },
    { filename: "Assignment.pdf", contentType: "application/pdf" },
  ];

  return NextResponse.json(dummyNotes);
}
