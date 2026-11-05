"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "sonner";
import type { Studio } from "@/lib/types";

export default function MyListings() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    fetch("/api/server/studios/mine/list")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setStudios)
      .catch(() => toast.error("Couldn't load your listings"))
      .finally(() => setLoading(false));
  }, []);

  const askDelete = (s: Studio) => {
    setTarget(s);
    dialogRef.current?.showModal();
  };

  const confirmDelete = async () => {
    if (!target) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/server/studios/${target._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Couldn't delete the studio");
        return;
      }
      setStudios((prev) => prev.filter((s) => s._id !== target._id));
      toast.success("Studio deleted");
      dialogRef.current?.close();
      setTarget(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">My Studio Listings</h1>
          <p className="mt-2 opacity-70">Update or remove the spaces you host.</p>
        </div>
        <Link href="/add-studio" className="btn btn-primary">
          <FiPlus /> Add New Studio
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20 w-full" />
          ))}
        </div>
      ) : studios.length === 0 ? (
        <div className="rounded-box border border-dashed border-base-300 p-12 text-center">
          <h2 className="mb-2 text-xl font-bold">You haven&apos;t listed a studio yet</h2>
          <p className="mb-5 opacity-70">List your first space and start getting booked.</p>
          <Link href="/add-studio" className="btn btn-primary">
            List your first studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-300 bg-base-100">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((s) => (
                <tr key={s._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={s.image} alt={s.title} className="h-12 w-16 rounded object-cover bg-base-200" />
                      <Link href={`/studios/${s._id}`} className="font-semibold hover:text-primary">
                        {s.title}
                      </Link>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary badge-outline whitespace-nowrap">{s.category}</span>
                  </td>
                  <td className="whitespace-nowrap">${s.hourlyRate} / hr</td>
                  <td>{s.location}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/studios/edit/${s._id}`} className="btn btn-sm btn-outline">
                        <FiEdit2 /> Update
                      </Link>
                      <button onClick={() => askDelete(s)} className="btn btn-sm btn-error btn-outline">
                        <FiTrash2 /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold">Delete this studio?</h3>
          <p className="mt-3 opacity-80">
            <span className="font-semibold">{target?.title}</span> will be removed permanently. This can&apos;t be
            undone.
          </p>
          <div className="modal-action">
            <button className="btn" onClick={() => dialogRef.current?.close()} disabled={deleting}>
              Keep it
            </button>
            <button className="btn btn-error" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <span className="loading loading-spinner" /> : "Yes, delete"}
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