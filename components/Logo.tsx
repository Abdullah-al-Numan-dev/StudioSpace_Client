import Link from "next/link";
import { FiAperture } from "react-icons/fi";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-content">
        <FiAperture size={22} />
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}