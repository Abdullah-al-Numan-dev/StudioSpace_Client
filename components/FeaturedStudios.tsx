import Link from "next/link";
import SectionHeading from "./SectionHeading";
import StudioCard from "./StudioCard";
import type { Studio } from "@/lib/types";

async function getFeatured(): Promise<Studio[]> {
  try {
    const res = await fetch(`${process.env.API_URL}/api/studios?sort=rating&limit=6`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function FeaturedStudios() {
  const studios = await getFeatured();

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="Featured Studios"
        subtitle="Top-rated spaces from verified hosts, ready to book."
      />

      {studios.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-10 text-center">
          <p className="mb-4 opacity-70">
            We couldn&apos;t load studios right now. Please try again in a moment.
          </p>
          <Link href="/studios" className="btn btn-primary">
            Browse All Studios
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((s) => (
              <StudioCard key={s._id} studio={s} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/studios" className="btn btn-outline">
              See All Studios
            </Link>
          </div>
        </>
      )}
    </section>
  );
}