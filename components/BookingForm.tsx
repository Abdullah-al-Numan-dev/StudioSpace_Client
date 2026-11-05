"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
  studioId: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  onClose: () => void;
};

const todayLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const toMinutes = (t: string) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function BookingForm({ studioId, hourlyRate, securityDeposit, maxCapacity, onClose }: Props) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const start = toMinutes(startTime);
  const end = toMinutes(endTime);
  const hours = start !== null && end !== null && end > start ? (end - start) / 60 : 0;
  const total = hours * hourlyRate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (hours < 1) {
      setError("Choose an end time at least one hour after the start time");
      return;
    }
    if (guests < 1 || guests > maxCapacity) {
      setError(`Guests must be between 1 and ${maxCapacity}`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/server/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studioId, date, startTime, endTime, guests, notes }),
      });

      if (res.status === 401) {
        toast.error("Your session expired. Please log in again.");
        router.push("/login");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = data.message || "Couldn't create the booking";
        setError(message);
        toast.error(message);
        return;
      }
      toast.success("Booking request sent. The host will confirm it soon.");
      onClose();
      router.push("/my-bookings");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Date</span>
        <input
          type="date"
          required
          min={todayLocal()}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input input-bordered w-full"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Start time</span>
          <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input input-bordered w-full" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">End time</span>
          <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input input-bordered w-full" />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Guests (max {maxCapacity})</span>
        <input
          type="number"
          min={1}
          max={maxCapacity}
          required
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="input input-bordered w-full"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-medium">Notes for the host (optional)</span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          maxLength={500}
          placeholder="What are you planning to shoot or record?"
          className="textarea textarea-bordered w-full"
        />
      </label>

      <div className="space-y-1 rounded-box bg-base-200 p-4 text-sm">
        <div className="flex justify-between">
          <span className="opacity-70">
            {hours > 0 ? `${hours} hr × $${hourlyRate}` : "Rate"}
          </span>
          <span className="font-semibold">${hours > 0 ? total.toFixed(2) : `${hourlyRate} / hr`}</span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-70">Refundable security deposit</span>
          <span className="font-semibold">${securityDeposit}</span>
        </div>
      </div>

      {error && (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          {error}
        </div>
      )}

      <div className="modal-action mt-2">
        <button type="button" className="btn" onClick={onClose} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? <span className="loading loading-spinner" /> : "Request booking"}
        </button>
      </div>
    </form>
  );
}