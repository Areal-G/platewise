"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Eye, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEMO_READONLY_EVENT, exitDemo, isDemoMode } from "@/lib/demo";

const subscribeNoop = () => () => {};

// Shows a guest banner in demo mode and a notice when a read-only action is attempted
export function DemoBanner() {
  const router = useRouter();
  // Read the demo cookie on the client only, so server and first client render match
  const isDemo = useSyncExternalStore(subscribeNoop, isDemoMode, () => false);
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const onReadOnly = () => setShowNotice(true);
    window.addEventListener(DEMO_READONLY_EVENT, onReadOnly);
    return () => window.removeEventListener(DEMO_READONLY_EVENT, onReadOnly);
  }, []);

  const handleExit = () => {
    exitDemo();
    router.push("/");
    router.refresh();
  };

  if (!isDemo) return null;

  return (
    <>
      <div className="sticky top-0 z-30 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-center text-xs sm:text-sm text-white">
        <span className="flex items-center gap-1.5 font-medium">
          <Eye className="h-4 w-4" />
          You&apos;re viewing a read-only guest demo with sample data
        </span>
        <span className="flex items-center gap-3">
          <Link href="/signup" onClick={exitDemo} className="font-semibold underline underline-offset-2 hover:no-underline">
            Create free account
          </Link>
          <button onClick={handleExit} className="opacity-90 hover:opacity-100 underline underline-offset-2">
            Exit demo
          </button>
        </span>
      </div>

      {showNotice && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowNotice(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowNotice(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <Lock className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">You&apos;re in guest mode</h3>
            <p className="mb-6 text-sm text-gray-600">
              This demo is read-only, so generating, editing and deleting are turned off.
              Create a free account to make your own food photos, menus and designs.
            </p>
            <div className="flex flex-col gap-2">
              <Link href="/signup" onClick={exitDemo}>
                <Button className="w-full">Create Free Account</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => setShowNotice(false)}>
                Keep Exploring
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
