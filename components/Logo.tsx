"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export default function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* Logo Icon - Square with chevrons */}
      <div className="relative">
        <div className="w-10 h-10 rounded-lg border-4 border-primary flex items-center justify-center bg-background group-hover:border-secondary transition-colors">
          <div className="flex items-center gap-1">
            <span className="text-primary text-lg font-bold">&lt;</span>
            <span className="text-secondary text-lg font-bold">&gt;</span>
          </div>
        </div>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className="text-2xl font-bold text-primary">
          Open<span className="text-secondary">Dev</span>
        </span>
      )}
    </Link>
  );
}

