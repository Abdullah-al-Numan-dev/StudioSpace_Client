"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { toast } from "sonner";
import StudioCard from "./StudioCard";
import StudioSkeleton from "./StudioSkeleton";
import type { Studio } from "@/lib/types";

const categories = ["All", "Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];

function useDebounce<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ExploreStudios() {
  const params = useSearchParams();
  const urlCategory = params.get("category") || "All";

  const [category, setCategory] = useState(urlCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const dSearch = useDebounce(search);
  const dMin = useDebounce(minPrice);
  const dMax = useDebounce(maxPrice);

  // Follow the URL when a category link (home, footer) is clicked
  useEffect(() => {
    setCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    const controller = new AbortController();
    const q = new URLSearchParams();
    if (dSearch.trim()) q.set("search", dSearch.trim());
    if (category !== "All") q.set("category", category);
    if (sort !== "newest") q.set("sort", sort);
    if (dMin) q.set("minPrice", dMin);
    if (dMax) q.set("maxPrice", dMax);

    setLoading(true);
    setFailed(false);
    fetch(`/api/server/studios?${q.toString()}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("bad response");
        return r.json();
      })
      .then((data: Studio[]) => setStudios(data))
      .catch((e) => {
        if (e.name === "AbortError") return;
        setFailed(true);
        toast.error("Couldn't load studios. Please try again.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [dSearch, category, sort, dMin, dMax]);

  const hasFilters = search || minPrice || maxPrice || category !== "All" || sort !== "newest";

  const clearFilters = () => {
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setCategory("All");
    setSort("newest");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Explore Studios</h1>
        <p className="mt-2 opacity-70">
          Search by name or city, then narrow by category, price, and rating.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4 rounded-box border border-base-300 bg-base-100 p-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="input input-bordered flex items-center gap-2 md:col-span-2">
            <FiSearch className="opacity-60" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by studio name or location"
              className="grow"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select select-bordered w-full"
            aria-label="Sort studios"
          >
            <option value="newest">Newest first</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min $"
              className="input input-bordered w-full min-w-0"
            />
            <input
              type="number"
              min={0}
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max $"
              className="input input-bordered w-full min-w-0"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? "btn-primary" : "btn-outline"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudioSkeleton key={i} />
          ))}
        </div>
      ) : failed ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="mb-2 text-xl font-bold">We couldn&apos;t reach the studio list</h2>
          <p className="mb-5 opacity-70">Check your connection and try again.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      ) : studios.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="mb-2 text-xl font-bold">No studios match your search</h2>
          <p className="mb-5 opacity-70">
            Try a different keyword, widen the price range, or clear the filters.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {hasFilters && (
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear filters
              </button>
            )}
            <Link href="/add-studio" className="btn btn-outline">
              List your own studio
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm opacity-70">
            Showing {studios.length} {studios.length === 1 ? "studio" : "studios"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}