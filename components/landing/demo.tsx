"use client";

import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { enterDemo } from "@/lib/demo";

export function LandingDemo() {
  const router = useRouter();

  // Drop visitors into a read-only dashboard with sample data
  const openDemo = () => {
    enterDemo();
    router.push("/dashboard");
  };

  return (
    <section className="relative py-24 px-4 bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold sm:text-5xl">
            See{" "}
            <span className="relative bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 bg-clip-text text-transparent cursive-text">
              Platewise
            </span>{" "}
            in Action
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Step inside a sample restaurant account and explore the gallery, history, and every tool. No signup needed.
          </p>
        </div>

        {/* Demo Thumbnail */}
        <div className="relative mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl border-4 border-orange-200 bg-white shadow-2xl shadow-orange-500/20">
            {/* 16:9 Aspect Ratio Container */}
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%" }}
            >
              {/* Thumbnail Image */}
              <img
                src="/hero-mockup.webp"
                alt="Platewise Demo Thumbnail"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Demo Button Overlay */}
              <button
                onClick={openDemo}
                className="absolute inset-0 flex items-center justify-center group cursor-pointer hover:bg-black/10 transition-colors"
              >
                <div className="flex items-center gap-2 rounded-full bg-orange-500 px-7 py-4 text-lg font-semibold text-white shadow-2xl group-hover:scale-105 transition-transform">
                  <Sparkles className="h-5 w-5" />
                  Try Live Demo
                </div>
              </button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-orange-500/10 blur-2xl" />
          <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-orange-500/10 blur-2xl" />
        </div>

  
        {/* Stats */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600">6 Tools</div>
            <p className="text-sm text-muted-foreground">One Studio</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600">
              4 Steps
            </div>
            <p className="text-sm text-muted-foreground">Simple Process</p>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600">∞</div>
            <p className="text-sm text-muted-foreground">Unlimited Images</p>
          </div>
        </div>
      </div>
    </section>
  );
}
