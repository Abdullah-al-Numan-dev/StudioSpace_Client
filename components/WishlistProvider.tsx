"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type WishlistContext = {
  ids: Set<string>;
  ready: boolean;
  toggle: (studioId: string) => Promise<void>;
};

const Ctx = createContext<WishlistContext>({
  ids: new Set(),
  ready: false,
  toggle: async () => {},
});

export const useWishlist = () => useContext(Ctx);

export default function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const router = useRouter();
  const pathname = usePathname();
  const [ids, setIds] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIds(new Set());
      setReady(false);
      return;
    }
    let cancelled = false;
    // Make sure the JWT cookie exists before calling Express
    fetch("/api/token", { method: "POST" })
      .then(() => fetch("/api/server/wishlist"))
      .then((r) => (r.ok ? r.json() : []))
      .then((list: string[]) => {
        if (!cancelled) {
          setIds(new Set(list));
          setReady(true);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggle = useCallback(
    async (studioId: string) => {
      if (!userId) {
        toast.info("Log in to save studios");
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }
      const saved = ids.has(studioId);
      const apply = (add: boolean) =>
        setIds((prev) => {
          const next = new Set(prev);
          if (add) next.add(studioId);
          else next.delete(studioId);
          return next;
        });

      apply(!saved); // optimistic update
      try {
        const res = await fetch(`/api/server/wishlist/${studioId}`, {
          method: saved ? "DELETE" : "POST",
        });
        if (!res.ok) throw new Error();
        toast.success(saved ? "Removed from saved studios" : "Saved to your wishlist");
      } catch {
        apply(saved); // roll back
        toast.error("Couldn't update your wishlist. Please try again.");
      }
    },
    [ids, userId, router, pathname]
  );

  const value = useMemo(() => ({ ids, ready, toggle }), [ids, ready, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}