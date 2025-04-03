"use client";

import SignOutButton from "@/components/SignOutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col">
      <header className="bg-primary text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Dashen Bank Dashboard</h1>
        <SignOutButton />
      </header>
      <main className="flex-1 flex items-center justify-center p-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center p-4">
        <p>&copy; 2025 Dashen Bank. All rights reserved.</p>
      </footer>
    </div>
  );
}
