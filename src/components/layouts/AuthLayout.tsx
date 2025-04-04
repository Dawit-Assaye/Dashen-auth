"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dots = Array.from({ length: 20 }, (_, i) => ({
    cx: Math.random() * 100,
    cy: Math.random() * 100,
    r: Math.random() * 1 + 0.5,
  }));
  const lines = Array.from({ length: 5 }, (_, i) => ({
    x1: Math.random() * 100,
    y1: Math.random() * 100,
    x2: Math.random() * 100,
    y2: Math.random() * 100,
  }));

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center text-white relative overflow-hidden max-sm:hidden">
        <div className="absolute inset-0 bg-primary" />
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <circle
              key={`arc-${i}`}
              cx="0"
              cy="100"
              r={(i + 1) * 10}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
            />
          ))}
          {dots.map((dot, i) => (
            <circle
              key={`dot-${i}`}
              cx={dot.cx}
              cy={dot.cy}
              r={dot.r}
              fill="rgba(255, 255, 255, 0.2)"
            />
          ))}
          {lines.map((line, i) => (
            <line
              key={`line-${i}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.3"
            />
          ))}
        </svg>
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-center z-10">Welcome to</h1>
          <h1 className="text-4xl font-bold text-center z-10">
            Dashen Super App Dashboard
          </h1>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 gap-6 bg-background text-foreground max-sm:w-full">
        <Image
          src="/dashen_logo.png"
          alt="Dashen Bank"
          width={96}
          height={96}
        />
        <div className="flex items-center flex-col gap-3">
          <h2 className="text-2xl font-bold">LOGIN</h2>
          <p className="text-gray-600">Welcome to Dashen Bank Dashboard!</p>
        </div>
        {children}
      </div>
    </div>
  );
}
