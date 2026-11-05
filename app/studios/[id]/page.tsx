import { notFound } from "next/navigation";
import { FiCheck, FiMapPin, FiStar, FiUsers } from "react-icons/fi";
import BookingButton from "@/components/BookingButton";
import StudioGallery from "@/components/StudioGallery";
import type { Studio } from "@/lib/types";

async function getStudio(id: string): Promise<Studio | null> {
    try {
        const res = await fetch(`${process.env.API_URL}/api/studios/${id}`, { cache: "no-store" });
        if (res.status === 404 || res.status === 400) return null;
        if (!res.ok) throw new Error("Failed to load studio");
        return await res.json();
    } catch (err) {
        if (err instanceof Error && err.message === "Failed to load studio") throw err;
        return null;
    }
}

export default async function StudioDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const studio = await getStudio(id);
    if (!studio) notFound();

    const images = studio.gallery?.length ? studio.gallery : [studio.image];

    return (
        <section className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left column */}
                <div className="space-y-8 lg:col-span-2">
                    <StudioGallery images={images} title={studio.title} />

                    <div>
                        <div className="mb-3 flex flex-wrap items-center gap-3">
                            <span className="badge badge-primary">{studio.category}</span>
                            <span className="flex items-center gap-1 text-sm">
                                <FiStar className="text-warning" />
                                {studio.rating ? studio.rating.toFixed(1) : "New"}
                                {studio.reviews?.length > 0 && (
                                    <span className="opacity-60">
                                        ({studio.reviews.length} {studio.reviews.length === 1 ? "review" : "reviews"})
                                    </span>
                                )}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold sm:text-4xl">{studio.title}</h1>
                        <p className="mt-2 flex items-center gap-1 opacity-70">
                            <FiMapPin /> {studio.location}
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-bold">Overview</h2>
                        <p className="leading-relaxed opacity-80">
                            {studio.overview || "The host hasn't added a description yet."}
                        </p>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-bold">Amenities</h2>
                        {studio.amenities?.length ? (
                            <ul className="grid gap-2 sm:grid-cols-2">
                                {studio.amenities.map((a) => (
                                    <li key={a} className="flex items-center gap-2">
                                        <FiCheck className="text-primary" /> {a}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="opacity-70">No amenities listed.</p>
                        )}
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-bold">Reviews</h2>
                        {studio.reviews?.length ? (
                            <div className="space-y-4">
                                {studio.reviews.map((r, i) => (
                                    <div key={`${r.name}-${i}`} className="rounded-box border border-base-300 bg-base-100 p-4">
                                        <div className="mb-1 flex items-center justify-between">
                                            <p className="font-semibold">{r.name}</p>
                                            <span className="flex items-center gap-1 text-sm">
                                                <FiStar className="text-warning" /> {r.rating}
                                            </span>
                                        </div>
                                        <p className="text-sm opacity-80">{r.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="opacity-70">No reviews yet. Be the first to book and share your experience.</p>
                        )}
                    </div>
                </div>

                {/* Right column: booking card */}
                <aside className="lg:sticky lg:top-24 lg:self-start">
                    <div className="space-y-5 rounded-box border border-base-300 bg-base-100 p-6 shadow-sm">
                        <p>
                            <span className="text-3xl font-extrabold text-primary">${studio.hourlyRate}</span>
                            <span className="opacity-70"> / hour</span>
                        </p>

                        <ul className="space-y-2 text-sm">
                            <li className="flex justify-between">
                                <span className="opacity-70">Security deposit</span>
                                <span className="font-semibold">${studio.securityDeposit}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="opacity-70">Max capacity</span>
                                <span className="flex items-center gap-1 font-semibold">
                                    <FiUsers /> {studio.maxCapacity} people
                                </span>
                            </li>
                        </ul>

                        <BookingButton
                            studioId={studio._id}
                            title={studio.title}
                            hourlyRate={studio.hourlyRate}
                            securityDeposit={studio.securityDeposit}
                            ownerEmail={studio.ownerEmail}
                        />

                        <div className="border-t border-base-300 pt-4">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-60">Hosted by</p>
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-content">
                                    {studio.ownerName?.charAt(0).toUpperCase() || "H"}
                                </span>
                                <div className="min-w-0">
                                    <p className="font-semibold">{studio.ownerName}</p>
                                    <p className="truncate text-xs opacity-60">{studio.ownerEmail}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    );
}