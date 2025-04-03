"use client";
import SignOutButton from "@/components/SignOutButton";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const session = useSession();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome to Dashen Bank Dashboard!
        </h1>
        <p>Full Name: {session?.data?.user?.fullName || "N/A"}</p>
        {/* Email might be available from other providers if configured */}
        <p>Email: {session?.data?.user?.email || "N/A"}</p>
        <p>Phone Number: {session?.data?.user?.phoneNumber || "N/A"}</p>
        <p>Role: {session?.data?.user?.userRole || "N/A"}</p>
        <SignOutButton />
      </div>
    </div>
  );
}
