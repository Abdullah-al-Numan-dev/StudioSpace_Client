import { FiCheckCircle, FiClock, FiSearch, FiVideo } from "react-icons/fi";
import SectionHeading from "./SectionHeading";

const steps = [
  { icon: FiSearch, title: "Discover Spaces", text: "Filter by category, price, and location to find a room that fits your shoot." },
  { icon: FiClock, title: "Select Shoot Hours", text: "Check live availability and choose the exact time slot you need." },
  { icon: FiCheckCircle, title: "Book Instantly", text: "Send your request with clear pricing and a transparent security deposit." },
  { icon: FiVideo, title: "Create & Produce", text: "Show up, set up, and focus on making something great." },
];

export default function HowBookingWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <SectionHeading
        title="How Booking Works"
        subtitle="From first search to final take in four simple steps."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="relative h-full rounded-box border border-base-300 bg-base-100 p-6">
            <span className="absolute right-5 top-4 text-5xl font-extrabold opacity-10">{i + 1}</span>
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-content">
              <Icon size={24} />
            </span>
            <h3 className="mb-2 text-lg font-bold">
              {i + 1}. {title}
            </h3>
            <p className="text-sm opacity-70">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}