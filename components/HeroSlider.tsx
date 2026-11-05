"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1800",
    title: "Book the perfect photo studio by the hour",
    text: "Cyclorama walls, natural light lofts, and full strobe kits, ready when you are.",
  },
  {
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1800",
    title: "Sound stages built for your next production",
    text: "Column-free halls with lighting grids, green screens, and serious power.",
  },
  {
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=1800",
    title: "Record your podcast in a room that sounds right",
    text: "Treated acoustics, broadcast mics, and a mixing desk, all set up for you.",
  },
];

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      pagination={{ clickable: true }}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      loop
      className="h-[70vh] min-h-[480px] w-full bg-neutral"
    >
      {slides.map((s, i) => (
        <SwiperSlide key={s.title}>
          <div className="relative h-full w-full bg-neutral">
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={i === 0}
              sizes="100vw"
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="relative mx-auto flex h-full max-w-7xl flex-col items-start justify-center gap-5 px-4 text-white">
              <h1 className="max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
                {s.title}
              </h1>
              <p className="max-w-xl text-lg text-white/85">{s.text}</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/studios" className="btn btn-primary">
                  Explore Studios
                </Link>
                <Link href="/add-studio" className="btn btn-outline border-white text-white hover:bg-white hover:text-black">
                  Host Your Space
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}