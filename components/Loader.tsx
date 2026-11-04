import { FiAperture } from "react-icons/fi";

export default function Loader({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
      <FiAperture size={48} className="animate-spin text-primary" />
      <p className="text-sm font-medium opacity-70">{label}...</p>
    </div>
  );
}