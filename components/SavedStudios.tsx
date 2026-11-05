"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StudioCard from "./StudioCard";
import StudioSkeleton from "./StudioSkeleton";
import { useWishlist } from "./WishlistProvider";
import type { Studio } from "@/lib/types";

export default function SavedStudios() {
  const { ids, ready } = useWishlist();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/server/wishlist/studios")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setStudios)
      .catch(() => toast.error("Couldn't load your saved studios"))
      .finally(() => setLoading(false));
  }, []);

  // Studios you un-heart disappear right away
  const shown = ready ? studios.filter((s) => ids.has(s._id)) : studios;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Saved Studios</h1>
      <p className="mb-8 mt-2 opacity-70">Spaces you want to come back to.</p>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StudioSkeleton key={i} />
          ))}
        </div>
      ) : shown.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="mb-2 text-xl font-bold">Nothing saved yet</h2>
          <p className="mb-5 opacity-70">Tap the heart on any studio to keep it here.</p>
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((s) => (
            <StudioCard key={s._id} studio={s} />
          ))}
        </div>
      )}
    </section>
  );
}