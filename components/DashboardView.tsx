"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiDollarSign, FiHome, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import type { Booking, Studio } from "@/lib/types";

const badge: Record<Booking["status"], string> = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function DashboardView() {
  const { data: session } = authClient.useSession();
  const [listings, setListings] = useState<Studio[]>([]);
  const [mine, setMine] = useState<Booking[]>([]);
  const [host, setHost] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const get = (url: string) => fetch(url).then((r) => (r.ok ? r.json() : Promise.reject()));
    Promise.all([
      get("/api/server/studios/mine/list"),
      get("/api/server/bookings/mine"),
      get("/api/server/bookings/host"),
    ])
      .then(([l, m, h]) => {
        setListings(l);
        setMine(m);
        setHost(h);
      })
      .catch(() => toast.error("Couldn't load your dashboard"))
      .finally(() => setLoading(false));
  }, []);

  const earnings = host
    .filter((b) => b.status === "Confirmed" || b.status === "Completed")
    .reduce((sum, b) => sum + b.totalPrice, 0);
  const pending = host.filter((b) => b.status === "Pending").length;
  const upcoming = mine.filter((b) => b.status === "Confirmed").length;

  const stats = [
    { icon: FiHome, label: "Studios listed", value: listings.length },
    { icon: FiCalendar, label: "Upcoming sessions", value: upcoming },
    { icon: FiClock, label: "Requests awaiting you", value: pending },
    { icon: FiDollarSign, label: "Host earnings", value: `$${earnings.toFixed(2)}` },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Welcome back{session?.user?.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 opacity-70">Here is what is happening with your studios and sessions.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">
          <FiPlus /> Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 rounded-box border border-base-300 bg-base-100 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={24} />
                </span>
                <div>
                  <p className="text-2xl font-extrabold">{value}</p>
                  <p className="text-sm opacity-70">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recent reservations</h2>
                <Link href="/my-bookings" className="text-sm font-semibold text-primary hover:underline">
                  View all
                </Link>
              </div>
              {mine.length === 0 ? (
                <div className="rounded-box border border-dashed border-base-300 p-10 text-center">
                  <p className="mb-4 opacity-70">You have not booked a studio yet.</p>
                  <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {mine.slice(0, 5).map((b) => (
                    <div key={b._id} className="flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-100 p-4">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{b.studioTitle}</p>
                        <p className="text-sm opacity-70">
                          {b.date} · {b.startTime} to {b.endTime}
                        </p>
                      </div>
                      <span className={`badge ${badge[b.status]}`}>{b.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-bold">Quick actions</h2>
              <div className="flex flex-col gap-3">
                <Link href="/my-listings" className="btn btn-outline justify-start">My Studio Listings</Link>
                <Link href="/my-bookings" className="btn btn-outline justify-start">
                  Manage booking requests
                  {pending > 0 && <span className="badge badge-warning badge-sm">{pending}</span>}
                </Link>
                <Link href="/studios" className="btn btn-outline justify-start">Browse studios</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}