"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Welcome, {session?.user?.fullName || "User"}!
      </h1>
      <div className="space-y-4 text-left">
        <p className="text-gray-700">
          <span className="font-semibold">Email:</span>{" "}
          {session?.user?.email || "N/A"}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Phone:</span>{" "}
          {session?.user?.phoneNumber || "N/A"}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Role:</span>{" "}
          {session?.user?.userRole || "N/A"}
        </p>
      </div>
    </div>
  );
}
