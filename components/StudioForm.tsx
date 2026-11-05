"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ImageUpload from "./ImageUpload";
import type { Studio } from "@/lib/types";

const categories = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];
const suggestedAmenities = [
  "Wi-Fi",
  "Parking",
  "Air Conditioning",
  "Green Room",
  "Lighting Kit",
  "Backdrops",
  "Sound Treatment",
  "Coffee Bar",
  "Makeup Station",
  "Power Backup",
];

export default function StudioForm({ studio }: { studio?: Studio }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const isEdit = Boolean(studio);

  const [image, setImage] = useState(studio?.image ?? "");
  const [amenities, setAmenities] = useState<string[]>(studio?.amenities ?? []);
  const [custom, setCustom] = useState("");
  const [saving, setSaving] = useState(false);

  const ownerName = studio?.ownerName ?? session?.user?.name ?? "";
  const ownerEmail = studio?.ownerEmail ?? session?.user?.email ?? "";

  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    if (amenities.some((a) => a.toLowerCase() === value.toLowerCase())) {
      toast.info("That amenity is already added");
    } else {
      setAmenities((prev) => [...prev, value]);
    }
    setCustom("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (!image) {
      toast.error("Please add a studio image");
      return;
    }
    const hourlyRate = Number(form.get("hourlyRate"));
    if (!(hourlyRate > 0)) {
      toast.error("Hourly rate must be greater than zero");
      return;
    }

    const payload = {
      title: String(form.get("title")).trim(),
      category: String(form.get("category")),
      hourlyRate,
      securityDeposit: Number(form.get("securityDeposit")) || 0,
      maxCapacity: Number(form.get("maxCapacity")) || 1,
      location: String(form.get("location")).trim(),
      image,
      gallery: studio?.gallery?.length ? [image, ...studio.gallery.filter((g) => g !== studio.image && g !== image)] : [image],
      amenities,
      overview: String(form.get("overview")).trim(),
    };

    setSaving(true);
    try {
      const res = await fetch(isEdit ? `/api/server/studios/${studio!._id}` : "/api/server/studios", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || "Something went wrong. Please try again.");
        return;
      }
      toast.success(isEdit ? "Studio updated successfully" : "Studio listed successfully");
      router.push("/my-listings");
      router.refresh();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Studio title</span>
          <input name="title" required defaultValue={studio?.title} placeholder="e.g. Northlight Cyclorama Studio" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Category</span>
          <select name="category" required defaultValue={studio?.category ?? ""} className="select select-bordered w-full">
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Location / address</span>
          <input name="location" required defaultValue={studio?.location} placeholder="Area, City" className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Hourly rate ($)</span>
          <input name="hourlyRate" type="number" min={1} required defaultValue={studio?.hourlyRate} className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Security deposit ($)</span>
          <input name="securityDeposit" type="number" min={0} required defaultValue={studio?.securityDeposit} className="input input-bordered w-full" />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Max capacity (people)</span>
          <input name="maxCapacity" type="number" min={1} required defaultValue={studio?.maxCapacity} className="input input-bordered w-full" />
        </label>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Studio image</span>
        <ImageUpload value={image} onChange={setImage} />
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">Amenities</span>
        <div className="flex flex-wrap gap-2">
          {suggestedAmenities.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleAmenity(a)}
              className={`btn btn-sm ${amenities.includes(a) ? "btn-primary" : "btn-outline"}`}
            >
              {a}
            </button>
          ))}
          {amenities
            .filter((a) => !suggestedAmenities.includes(a))
            .map((a) => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} className="btn btn-sm btn-primary" title="Click to remove">
                {a} ×
              </button>
            ))}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="Add your own amenity"
            className="input input-bordered w-full min-w-0"
          />
          <button type="button" onClick={addCustom} className="btn btn-outline">
            Add
          </button>
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Detailed overview</span>
        <textarea
          name="overview"
          required
          rows={5}
          defaultValue={studio?.overview}
          placeholder="Describe the space, size, lighting, and what creators can shoot or record here."
          className="textarea textarea-bordered w-full"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Host name</span>
          <input value={ownerName} readOnly className="input input-bordered w-full opacity-70" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Host email</span>
          <input value={ownerEmail} readOnly className="input input-bordered w-full opacity-70" />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? <span className="loading loading-spinner" /> : isEdit ? "Save changes" : "Publish studio"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Cancel
        </button>
      </div>
    </form>
  );
}