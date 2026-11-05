import { FiLifeBuoy, FiShield, FiTool, FiUserCheck } from "react-icons/fi";
import SectionHeading from "./SectionHeading";

const items = [
  { icon: FiShield, title: "Liability Protection", text: "Every confirmed booking is covered by our damage and liability policy." },
  { icon: FiUserCheck, title: "Verified Profiles", text: "Hosts and creators are identity-checked before their first booking." },
  { icon: FiTool, title: "Equipment Safety", text: "Hosts maintain and inspect gear so your session runs without surprises." },
  { icon: FiLifeBuoy, title: "24/7 Host Support", text: "A real person is available any time something goes wrong on a shoot day." },
];

export default function HostGuarantee() {
  return (
    <section className="bg-base-200 py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeading
          title="Host Guarantee & Creator Support"
          subtitle="Book with confidence, whether you're hosting a space or renting one."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="h-full rounded-box border border-base-300 bg-base-100 p-6 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon size={26} />
              </span>
              <h3 className="mb-2 text-lg font-bold">{title}</h3>
              <p className="text-sm opacity-70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}