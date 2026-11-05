import Link from "next/link";
import { FiHeart, FiShield, FiZap } from "react-icons/fi";
import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "About Us | StudioSpace" };

const values = [
  { icon: FiZap, title: "Speed over paperwork", text: "Finding and booking a room should take minutes, not a week of emails." },
  { icon: FiShield, title: "Trust by design", text: "Clear pricing, visible deposits, and overlap-proof scheduling protect both sides." },
  { icon: FiHeart, title: "Built for creators", text: "Photographers, podcasters, filmmakers, and musicians shaped every feature." },
];

const stats = [
  { value: "5", label: "Studio categories" },
  { value: "1 hr", label: "Minimum booking" },
  { value: "0", label: "Double bookings" },
];

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading
          title="About StudioSpace"
          subtitle="A peer-to-peer marketplace where creators rent the right room by the hour."
        />
        <div className="mx-auto max-w-3xl space-y-4 text-center leading-relaxed opacity-80">
          <p>
            Great work needs the right space, and most creators waste days chasing availability and
            negotiating prices. StudioSpace puts photo studios, sound stages, podcast lounges, music
            suites, and art workshops in one place, with live availability and honest pricing.
          </p>
          <p>
            Hosts earn from rooms that would otherwise sit empty. Creators get a reliable place to
            work. Every booking is checked against confirmed sessions so a time slot can never be
            sold twice.
          </p>
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-box border border-base-300 bg-base-100 p-6 text-center">
              <p className="text-4xl font-extrabold text-primary">{s.value}</p>
              <p className="mt-1 text-sm opacity-70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionHeading title="What We Believe" />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="h-full rounded-box border border-base-300 bg-base-100 p-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={26} />
              </span>
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-sm opacity-70">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/studios" className="btn btn-primary">Find a Studio</Link>
        </div>
      </section>
    </>
  );
}