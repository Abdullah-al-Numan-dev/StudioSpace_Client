"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";

function EditContent() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = authClient.useSession();
  const [studio, setStudio] = useState<Studio | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    fetch(`/api/server/studios/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: Studio) => {
        setStudio(data);
        setStatus("ready");
      })
      .catch(() => setStatus("missing"));
  }, [id]);

  if (status === "loading") return <Loader label="Loading your studio" />;

  if (status === "missing" || !studio) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold">Studio not found</h1>
        <p className="mb-5 opacity-70">It may have been deleted, or the link is wrong.</p>
        <Link href="/my-listings" className="btn btn-primary">Back to my listings</Link>
      </div>
    );
  }

  if (studio.ownerEmail !== session?.user?.email) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="mb-2 text-2xl font-bold">This isn&apos;t your listing</h1>
        <p className="mb-5 opacity-70">You can only edit studios that you host.</p>
        <Link href="/my-listings" className="btn btn-primary">Go to my listings</Link>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold sm:text-4xl">Update Studio</h1>
      <p className="mb-8 mt-2 opacity-70">Changes go live as soon as you save.</p>
      <StudioForm studio={studio} />
    </section>
  );
}

export default function EditStudioPage() {
  return (
    <PrivateRoute>
      <EditContent />
    </PrivateRoute>
  );
}