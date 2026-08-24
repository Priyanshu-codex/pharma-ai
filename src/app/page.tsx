import { redirect } from "next/navigation";

// Root page redirects to splash screen
export default function RootPage() {
  redirect("/splash");
}
