import { redirect } from "next/navigation";

export default function SponsorsPage() {
  redirect("/podcast?tab=sponsors");
}
