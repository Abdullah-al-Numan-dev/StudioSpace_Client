"use client";

import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa6";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ studioId }: { studioId: string }) {
  const { ids, toggle } = useWishlist();
  const saved = ids.has(studioId);

  return (
    <button
      type="button"
      onClick={() => toggle(studioId)}
      aria-label={saved ? "Remove from saved studios" : "Save this studio"}
      aria-pressed={saved}
      className="btn btn-circle btn-sm absolute bottom-3 right-3 border-0 bg-base-100/90 shadow"
    >
      {saved ? <FaHeart className="text-error" /> : <FiHeart />}
    </button>
  );
}