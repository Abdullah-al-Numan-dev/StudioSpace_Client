"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiAperture, FiMapPin, FiStar } from "react-icons/fi";
import type { Studio } from "@/lib/types";
import WishlistButton from "./WishlistButton";


export default function StudioCard({ studio }: { studio: Studio }) {
  const [broken, setBroken] = useState(false);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full bg-base-200">
        {broken ? (
          <div className="flex h-full w-full items-center justify-center">
            <FiAperture size={40} className="opacity-30" />
          </div>
        ) : (
          <Image
            src={studio.image}
            alt={studio.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            onError={() => setBroken(true)}
          />
        )}
        <span className="badge badge-primary absolute left-3 top-3">{studio.category}</span>
        <span className="badge absolute right-3 top-3 gap-1 border-0 bg-base-100">
          <FiStar className="text-warning" />
          {studio.rating ? studio.rating.toFixed(1) : "New"}
        </span>
        <WishlistButton studioId={studio._id} />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{studio.title}</h3>
        <p className="flex items-center gap-1 text-sm opacity-70">
          <FiMapPin className="shrink-0" />
          <span className="line-clamp-1">{studio.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <p>
            <span className="text-xl font-extrabold text-primary">${studio.hourlyRate}</span>
            <span className="text-sm opacity-70"> / hr</span>
          </p>
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}