"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
    >
      Sign Out
    </button>
  );
}
