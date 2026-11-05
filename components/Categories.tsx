import Link from "next/link";
import { FiCamera, FiEdit3, FiFilm, FiHeadphones, FiMic } from "react-icons/fi";
import SectionHeading from "./SectionHeading";

const categories = [
  { label: "Photo Studios", value: "Photo Studio", icon: FiCamera, note: "Cycs, lofts, and product booths" },
  { label: "Sound Stages", value: "Film Stage", icon: FiFilm, note: "Big floors for film and video" },
  { label: "Podcast Rooms", value: "Podcast Lounge", icon: FiMic, note: "Treated rooms with broadcast mics" },
  { label: "Music Suites", value: "Music Suite", icon: FiHeadphones, note: "Recording and live session rooms" },
  { label: "Art Workshops", value: "Workshop", icon: FiEdit3, note: "Easels, kilns, and open tables" },
];

export default function Categories() {
  return (
    <section className="bg-base-200 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Browse by Studio Category"
          subtitle="Pick the kind of space you need and we'll filter the list for you."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map(({ label, value, icon: Icon, note }) => (
            <Link
              key={value}
              href={`/studios?category=${encodeURIComponent(value)}`}
              className="group flex h-full flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-6 text-center transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-content">
                <Icon size={26} />
              </span>
              <h3 className="font-bold">{label}</h3>
              <p className="text-xs opacity-70">{note}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}