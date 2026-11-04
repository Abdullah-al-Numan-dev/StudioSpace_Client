"use client";

import { toast } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center gap-6 p-10">
      <h1 className="text-3xl font-bold">StudioSpace setup check</h1>
      <ThemeToggle />
      <button
        className="btn btn-primary"
        onClick={() => toast.success("Toast notifications are working")}
      >
        Test toast
      </button>
      <button
        className="btn btn-outline"
        onClick={async () => {
          const res = await fetch("/api/server/studios?limit=6");
          const data = await res.json();
          toast.info(`Server returned ${data.length} studios`);
        }}
      >
        Test server proxy
      </button>
    </main>
  );
}