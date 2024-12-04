"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export function MobileHeader() {
  return (
    <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3">
      <Link href="/dashboard" className="flex items-center gap-2.5">
        <Logo markClassName="shadow-md shadow-orange-500/30 rounded-xl" />
      </Link>
    </div>
  );
}

