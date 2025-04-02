/* eslint-disable @next/next/no-async-client-component */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession();

  console.log("Dashboard - Server-side session:", session);

  if (!session) {
    console.log("Dashboard - No session found, redirecting to /login");
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome to Dashen Bank Dashboard!
        </h1>
        <p>Full Name: {session?.user?.name || "N/A"}</p>
        <p>Email: {session?.user?.email || "N/A"}</p>
        <p>Avatar: {session?.user?.image || "N/A"}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
