"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Loader from "@/components/Loader";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("redirect") || "/";
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back to StudioSpace");
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="mb-1 text-3xl font-bold">Welcome back</h1>
        <p className="mb-6 text-sm opacity-70">Log in to manage your bookings and listings.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input input-bordered w-full" />
          </label>

          <button
            type="button"
            onClick={() => toast.info("Password reset isn't available yet")}
            className="text-sm text-primary hover:underline"
          >
            Forgot password?
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner" /> : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          New to StudioSpace?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Loader label="Loading" />}>
      <LoginForm />
    </Suspense>
  );
}