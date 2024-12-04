"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Camera,
  Wand2,
  FileText,
  Megaphone,
  Palette,
  Package,
  ArrowRight,
  Image,
  History,
  Lightbulb,
  Download,
  Sparkles,
  X,
} from "lucide-react";
import { format } from "date-fns";

const features = [
  {
    id: "generate",
    title: "Food Image Generator",
    description: "Create stunning AI food photography for your menu items",
    icon: Camera,
    href: "/dashboard/generate",
    color: "orange",
    bgGradient: "from-orange-500 to-orange-600",
    borderColor: "border-orange-200 hover:border-orange-400",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600 group-hover:text-orange-700",
  },
  {
    id: "enhance",
    title: "Photo Enhancer",
    description: "Upload and enhance your real food photos with AI magic",
    icon: Wand2,
    href: "/dashboard/enhance",
    color: "purple",
    bgGradient: "from-purple-500 to-purple-600",
    borderColor: "border-purple-200 hover:border-purple-400",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600 group-hover:text-purple-700",
  },
  {
    id: "menu",
    title: "Menu Maker",
    description: "Design beautiful digital menus with AI-generated visuals",
    icon: FileText,
    href: "/dashboard/menu",
    color: "blue",
    bgGradient: "from-blue-500 to-blue-600",
    borderColor: "border-blue-200 hover:border-blue-400",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600 group-hover:text-blue-700",
  },
  {
    id: "posters",
    title: "Ad Poster Generator",
    description: "Create eye-catching promotional posters for your dishes",
    icon: Megaphone,
    href: "/dashboard/posters",
    color: "red",
    bgGradient: "from-red-500 to-red-600",
    borderColor: "border-red-200 hover:border-red-400",
    bgColor: "bg-red-50",
    textColor: "text-red-600 group-hover:text-red-700",
  },
  {
    id: "logo",
    title: "Logo Creator",
    description: "Design professional logos for your restaurant brand",
    icon: Palette,
    href: "/dashboard/logo",
    color: "pink",
    bgGradient: "from-pink-500 to-pink-600",
    borderColor: "border-pink-200 hover:border-pink-400",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600 group-hover:text-pink-700",
  },
  {
    id: "packaging",
    title: "Packaging Designer",
    description: "Create branded packaging mockups for takeout and delivery",
    icon: Package,
    href: "/dashboard/packaging",
    color: "green",
    bgGradient: "from-green-500 to-green-600",
    borderColor: "border-green-200 hover:border-green-400",
    bgColor: "bg-green-50",
    textColor: "text-green-600 group-hover:text-green-700",
  },
];

const quickLinks = [
  {
    title: "Gallery",
    description: "View all your generated images",
    icon: Image,
    href: "/dashboard/gallery",
  },
  {
    title: "History",
    description: "Track your generation history",
    icon: History,
    href: "/dashboard/history",
  },
  {
    title: "Tips & Guide",
    description: "Learn how to get best results",
    icon: Lightbulb,
    href: "/dashboard/tips",
  },
];

interface RecentImage {
  id: string;
  prompt: string;
  enhanced_prompt: string | null;
  style: string;
  image_url: string;
  created_at: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0 });
  const [recent, setRecent] = useState<RecentImage[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [preview, setPreview] = useState<RecentImage | null>(null);

  const fetchStats = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoadingRecent(false);
      return;
    }

    const [{ count }, { data: recentData }] = await Promise.all([
      supabase
        .from("generated_images")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id),
      supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6),
    ]);

    setStats({ total: count || 0 });
    setRecent(recentData || []);
    setLoadingRecent(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome to Platewise
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              AI-powered tools to create stunning visuals for your restaurant
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center flex-1 sm:flex-none sm:min-w-[100px]">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Generated</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-3 text-center flex-1 sm:flex-none sm:min-w-[100px]">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">∞</p>
              <p className="text-xs text-gray-600">Remaining</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className={`group bg-white rounded-xl border-2 ${feature.borderColor} p-5 shadow-sm transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-gray-900 mb-1 ${feature.textColor} transition-colors`}>
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className={`mt-4 flex items-center text-sm font-medium ${feature.textColor}`}>
                  Get Started
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-4 hover:border-orange-300 transition-all"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">{link.title}</h3>
                    <p className="text-xs text-gray-500">{link.description}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Creations */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Creations</h2>
            {recent.length > 0 && (
              <Link
                href="/dashboard/gallery"
                className="flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>

          {loadingRecent ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse" />
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border-2 border-dashed border-gray-200 bg-white p-5">
              <p className="text-sm text-gray-600">
                Nothing here yet. Your latest images will show up here for quick access.
              </p>
              <Link
                href="/dashboard/generate"
                className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
              >
                <Sparkles className="h-4 w-4" />
                Create your first image
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {recent.map((image) => (
                <button
                  key={image.id}
                  onClick={() => setPreview(image)}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-100 text-left hover:border-orange-400 transition-all"
                >
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-6">
                    <p className="truncate text-xs font-medium text-white">{image.prompt}</p>
                    <p className="text-[10px] capitalize text-white/80">{image.style}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Getting Started Banner */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1">New to Platewise?</h2>
              <p className="text-orange-100 text-sm">
                Check out our tips and guide to create professional food imagery
              </p>
            </div>
            <Link
              href="/dashboard/tips"
              className="inline-flex items-center gap-2 bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-orange-50 transition-colors"
            >
              <Lightbulb className="h-4 w-4" />
              View Guide
            </Link>
          </div>
        </div>
      </div>

      {/* Image Preview */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreview(null)}
              aria-label="Close preview"
              className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-1.5 text-gray-500 shadow hover:text-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="bg-gray-100 md:w-3/5">
              <img
                src={preview.image_url}
                alt={preview.prompt}
                className="h-full max-h-[50vh] w-full object-contain md:max-h-[80vh]"
              />
            </div>
            <div className="flex flex-col gap-3 overflow-y-auto p-5 md:w-2/5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Prompt</p>
                <p className="mt-1 text-sm font-medium text-gray-900">{preview.prompt}</p>
              </div>
              {preview.enhanced_prompt && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">AI-enhanced</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-600">{preview.enhanced_prompt}</p>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 font-medium capitalize text-orange-700">
                  {preview.style}
                </span>
                {format(new Date(preview.created_at), "MMM d, yyyy · h:mm a")}
              </div>
              <div className="mt-auto flex gap-2 pt-2">
                <a
                  href={preview.image_url}
                  download={`platewise-${preview.id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600"
                >
                  <Download className="h-4 w-4" />
                  Download
                </a>
                <Link
                  href="/dashboard/gallery"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:border-orange-300"
                >
                  Open Gallery
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
