"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiCalendar, FiClock, FiDownload, FiUsers } from "react-icons/fi";
import { downloadInvoice } from "@/lib/invoice";
import { toast } from "sonner";
import type { Booking } from "@/lib/types";

const badge: Record<Booking["status"], string> = {
    Pending: "badge-warning",
    Confirmed: "badge-success",
    Completed: "badge-info",
    Cancelled: "badge-error",
};

const fmtTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtDate = (d: string) =>
    new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });

type Action = {
    booking: Booking;
    kind: "cancel" | "Confirmed" | "Cancelled" | "Completed";
};

const dialogText: Record<Action["kind"], { title: string; body: string; button: string; style: string }> = {
    cancel: {
        title: "Cancel this booking?",
        body: "The host will be notified and the slot will be released.",
        button: "Yes, cancel booking",
        style: "btn-error",
    },
    Confirmed: {
        title: "Confirm this booking?",
        body: "The time slot will be reserved and no one else can book it.",
        button: "Confirm booking",
        style: "btn-primary",
    },
    Cancelled: {
        title: "Decline this request?",
        body: "The guest's booking will be cancelled.",
        button: "Decline request",
        style: "btn-error",
    },
    Completed: {
        title: "Mark as completed?",
        body: "Use this after the session has taken place.",
        button: "Mark completed",
        style: "btn-primary",
    },
};

export default function MyBookings() {
    const [tab, setTab] = useState<"mine" | "host">("mine");
    const [mine, setMine] = useState<Booking[]>([]);
    const [host, setHost] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState<Action | null>(null);
    const [busy, setBusy] = useState(false);
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/server/bookings/mine").then((r) => (r.ok ? r.json() : Promise.reject())),
            fetch("/api/server/bookings/host").then((r) => (r.ok ? r.json() : Promise.reject())),
        ])
            .then(([m, h]) => {
                setMine(m);
                setHost(h);
            })
            .catch(() => toast.error("Couldn't load your bookings"))
            .finally(() => setLoading(false));
    }, []);

    const ask = (booking: Booking, kind: Action["kind"]) => {
        setAction({ booking, kind });
        dialogRef.current?.showModal();
    };

    const confirmAction = async () => {
        if (!action) return;
        const { booking, kind } = action;
        const isCancel = kind === "cancel";
        const newStatus: Booking["status"] = isCancel ? "Cancelled" : kind;

        setBusy(true);
        try {
            const res = await fetch(
                `/api/server/bookings/${booking._id}/${isCancel ? "cancel" : "status"}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(isCancel ? {} : { status: newStatus }),
                }
            );
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                toast.error(data.message || "Couldn't update the booking");
                dialogRef.current?.close();
                return;
            }
            const update = (list: Booking[]) =>
                list.map((b) => (b._id === booking._id ? { ...b, status: newStatus } : b));
            setMine(update);
            setHost(update);
            toast.success(data.message || "Booking updated");
            dialogRef.current?.close();
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setBusy(false);
        }
    };

    const list = tab === "mine" ? mine : host;
    const pendingRequests = host.filter((b) => b.status === "Pending").length;
    const handleInvoice = async (b: Booking) => {
        try {
            await downloadInvoice(b);
            toast.success("Invoice downloaded");
        } catch {
            toast.error("Couldn't create the invoice. Please try again.");
        }
    };

    return (
        <section className="mx-auto max-w-5xl px-4 py-12">
            <h1 className="text-3xl font-bold sm:text-4xl">My Bookings</h1>
            <p className="mb-6 mt-2 opacity-70">Track your reservations and manage requests for your studios.</p>

            <div className="mb-6 flex flex-wrap gap-2">
                <button onClick={() => setTab("mine")} className={`btn btn-sm ${tab === "mine" ? "btn-primary" : "btn-outline"}`}>
                    My reservations ({mine.length})
                </button>
                <button onClick={() => setTab("host")} className={`btn btn-sm ${tab === "host" ? "btn-primary" : "btn-outline"}`}>
                    Requests for my studios ({host.length})
                    {pendingRequests > 0 && <span className="badge badge-warning badge-sm">{pendingRequests} new</span>}
                </button>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="skeleton h-36 w-full" />
                    ))}
                </div>
            ) : list.length === 0 ? (
                <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
                    {tab === "mine" ? (
                        <>
                            <h2 className="mb-2 text-xl font-bold">No bookings yet</h2>
                            <p className="mb-5 opacity-70">Find a studio and reserve your first session.</p>
                            <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
                        </>
                    ) : (
                        <>
                            <h2 className="mb-2 text-xl font-bold">No requests yet</h2>
                            <p className="mb-5 opacity-70">When creators book your studios, their requests show up here.</p>
                            <Link href="/my-listings" className="btn btn-primary">View my listings</Link>
                        </>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {list.map((b) => (
                        <div key={b._id} className="flex flex-col gap-4 rounded-box border border-base-300 bg-base-100 p-4 sm:flex-row">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={b.studioImage} alt={b.studioTitle} className="h-32 w-full rounded-lg bg-base-200 object-cover sm:w-44" />

                            <div className="flex flex-1 flex-col gap-2">
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <Link href={`/studios/${b.studioId}`} className="text-lg font-bold hover:text-primary">
                                        {b.studioTitle}
                                    </Link>
                                    <span className={`badge ${badge[b.status]}`}>{b.status}</span>
                                </div>

                                <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm opacity-80">
                                    <span className="flex items-center gap-1"><FiCalendar /> {fmtDate(b.date)}</span>
                                    <span className="flex items-center gap-1"><FiClock /> {fmtTime(b.startTime)} to {fmtTime(b.endTime)}</span>
                                    <span className="flex items-center gap-1"><FiUsers /> {b.guests} {b.guests === 1 ? "guest" : "guests"}</span>
                                </div>

                                {tab === "host" && (
                                    <p className="text-sm opacity-70">
                                        Requested by <span className="font-semibold">{b.userName}</span> ({b.userEmail})
                                    </p>
                                )}
                                {b.notes && <p className="text-sm italic opacity-70">&ldquo;{b.notes}&rdquo;</p>}

                                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
                                    <p className="text-sm">
                                        <span className="text-xl font-extrabold text-primary">${b.totalPrice.toFixed(2)}</span>
                                        <span className="opacity-70"> total · ${b.securityDeposit} deposit</span>
                                    </p>

                                    <div className="flex gap-2">
                                        {(b.status === "Confirmed" || b.status === "Completed") && (
                                            <button onClick={() => handleInvoice(b)} className="btn btn-sm btn-outline">
                                                <FiDownload /> Invoice
                                            </button>
                                        )}
                                        {tab === "mine" && b.status === "Pending" && (
                                            <button onClick={() => ask(b, "cancel")} className="btn btn-sm btn-error btn-outline">
                                                Cancel Booking
                                            </button>
                                        )}
                                        {tab === "host" && b.status === "Pending" && (
                                            <>
                                                <button onClick={() => ask(b, "Cancelled")} className="btn btn-sm btn-outline btn-error">
                                                    Decline
                                                </button>
                                                <button onClick={() => ask(b, "Confirmed")} className="btn btn-sm btn-primary">
                                                    Confirm
                                                </button>
                                            </>
                                        )}
                                        {tab === "host" && b.status === "Confirmed" && (
                                            <button onClick={() => ask(b, "Completed")} className="btn btn-sm btn-outline">
                                                Mark completed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Confirmation modal */}
            <dialog ref={dialogRef} className="modal">
                <div className="modal-box">
                    <h3 className="text-xl font-bold">{action ? dialogText[action.kind].title : ""}</h3>
                    <p className="mt-3 opacity-80">
                        {action && (
                            <>
                                <span className="font-semibold">{action.booking.studioTitle}</span> on{" "}
                                {fmtDate(action.booking.date)}, {fmtTime(action.booking.startTime)} to{" "}
                                {fmtTime(action.booking.endTime)}. {dialogText[action.kind].body}
                            </>
                        )}
                    </p>
                    <div className="modal-action">
                        <button className="btn" onClick={() => dialogRef.current?.close()} disabled={busy}>
                            Go back
                        </button>
                        <button
                            className={`btn ${action ? dialogText[action.kind].style : ""}`}
                            onClick={confirmAction}
                            disabled={busy}
                        >
                            {busy ? <span className="loading loading-spinner" /> : action ? dialogText[action.kind].button : ""}
                        </button>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button aria-label="Close">close</button>
                </form>
            </dialog>
        </section>
    );
}