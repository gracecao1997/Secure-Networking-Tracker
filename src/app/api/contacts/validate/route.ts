import { NextResponse } from "next/server";
import { parseContactInput } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = parseContactInput(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        errors: result.errors,
      },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    contact: result.data,
  });
}
