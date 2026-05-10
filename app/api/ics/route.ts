import { NextResponse } from "next/server";
import { createIcsContent, getCalendarEventByUid } from "@/lib/google-calendar";

export async function GET(request: Request) {
  const uid = new URL(request.url).searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "Missing uid." }, { status: 400 });
  }

  const event = await getCalendarEventByUid(uid);

  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  return new NextResponse(createIcsContent(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.uid}.ics"`
    }
  });
}
