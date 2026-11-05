"use client";

import { useState } from "react";
import { FiUploadCloud } from "react-icons/fi";
import { toast } from "sonner";

export default function ImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
    if (!key) {
      toast.error("Image upload isn't configured. Paste an image URL instead.");
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
        method: "POST",
        body,
      });
      const json = await res.json();
      if (!res.ok || !json?.data?.url) throw new Error("Upload failed");
      onChange(json.data.url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed. Try again or paste a URL.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="btn btn-outline shrink-0">
          {uploading ? <span className="loading loading-spinner" /> : <FiUploadCloud />}
          {uploading ? "Uploading" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste an image URL"
          className="input input-bordered w-full"
        />
      </div>
      {value && (
        <div className="overflow-hidden rounded-box border border-base-300 bg-base-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Studio preview" className="aspect-[16/9] w-full object-cover" />
        </div>
      )}
    </div>
  );
}