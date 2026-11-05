"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Loader from "./Loader";

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const userId = session?.user?.id;

  useEffect(() => {
    // Wait for the session check. Never redirect while it is still pending.
    if (isPending) return;

    if (!userId) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // Make sure the HttpOnly JWT cookie exists before children call Express
    let cancelled = false;
    fetch("/api/token", { method: "POST" })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, userId, pathname, router]);

  if (isPending || !userId || !ready) return <Loader label="Checking your session" />;
  return <>{children}</>;
}