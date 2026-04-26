import { NextResponse } from "next/server";
import { getAllGuests } from "@/lib/queries";

export async function GET() {
  const guests = await getAllGuests();

  return NextResponse.json(guests);
}
