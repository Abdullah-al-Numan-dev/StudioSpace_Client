"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function StudioGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      className="aspect-[16/10] w-full overflow-hidden rounded-box bg-base-200"
    >
      {images.map((src, i) => (
        <SwiperSlide key={`${src}-${i}`}>
          <div className="relative h-full w-full">
            <Image
              src={src}
              alt={`${title} photo ${i + 1}`}
              fill
              unoptimized
              priority={i === 0}
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-cover"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}