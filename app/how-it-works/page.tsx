import Link from "next/link";
import HowBookingWorks from "@/components/HowBookingWorks";
import SectionHeading from "@/components/SectionHeading";

export const metadata = { title: "How It Works | StudioSpace" };

const hostSteps = [
  { title: "List your space", text: "Add photos, amenities, your hourly rate, and a refundable security deposit." },
  { title: "Review requests", text: "Every booking arrives as Pending. Confirm it or decline it from My Bookings." },
  { title: "Host the session", text: "Once confirmed, the slot is locked so nobody else can double-book it." },
  { title: "Mark it completed", text: "After the session, close the booking and build up your track record." },
];

const faqs = [
  {
    q: "Can two people book the same time slot?",
    a: "No. Requests can queue up as Pending, but once a host confirms one, any overlapping request is rejected with a clear message.",
  },
  {
    q: "What is the security deposit?",
    a: "A refundable amount set by each host to cover accidental damage. It is shown on every listing before you book.",
  },
  {
    q: "What is the minimum booking length?",
    a: "One hour. You can choose any start and end time that suits your shoot or recording.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes, while it is still Pending. Open My Bookings and use Cancel Booking to release the slot.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pt-16">
        <SectionHeading
          title="How StudioSpace Works"
          subtitle="Whether you are renting a room or hosting one, the process is simple and transparent."
        />
      </section>

      <HowBookingWorks />

      <section className="bg-base-200 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="For Hosts" subtitle="Turn an empty room into steady bookings." />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hostSteps.map((s, i) => (
              <div key={s.title} className="h-full rounded-box border border-base-300 bg-base-100 p-6">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-content">
                  {i + 1}
                </span>
                <h3 className="mb-2 text-lg font-bold">{s.title}</h3>
                <p className="text-sm opacity-70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeading title="Common Questions" />
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-box border border-base-300 bg-base-100 p-5">
              <summary className="cursor-pointer list-none font-semibold marker:hidden">
                {f.q}
              </summary>
              <p className="mt-3 text-sm opacity-80">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/studios" className="btn btn-primary">Explore Studios</Link>
          <Link href="/add-studio" className="btn btn-outline">Host Your Space</Link>
        </div>
      </section>
    </>
  );
}