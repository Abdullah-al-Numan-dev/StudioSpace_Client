import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-6 px-4 text-center">
      {/* Clapperboard illustration */}
      <svg viewBox="0 0 200 160" className="w-56" role="img" aria-label="Clapperboard">
        <rect x="20" y="60" width="160" height="90" rx="8" className="fill-base-300" />
        <g transform="rotate(-12 20 60)">
          <rect x="20" y="36" width="160" height="26" rx="6" className="fill-primary" />
          <path d="M45 36 l-14 26 M80 36 l-14 26 M115 36 l-14 26 M150 36 l-14 26" className="stroke-base-100" strokeWidth="8" />
        </g>
        <text x="100" y="116" textAnchor="middle" className="fill-base-content" fontSize="34" fontWeight="800">
          404
        </text>
      </svg>

      <h1 className="text-3xl font-bold">This scene didn&apos;t make the final cut</h1>
      <p className="opacity-70">
        The page you&apos;re looking for was moved, deleted, or never existed.
        Head back to the lobby and find your next studio.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </section>
  );
}