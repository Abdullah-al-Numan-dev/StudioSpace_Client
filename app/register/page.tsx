"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

function validatePassword(pw: string) {
  if (pw.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(pw)) return "Password must include an uppercase letter";
  if (!/[a-z]/.test(pw)) return "Password must include a lowercase letter";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const image = String(form.get("image")).trim();
    const password = String(form.get("password"));

    const pwError = validatePassword(password);
    setPasswordError(pwError);
    if (pwError) return;

    setLoading(true);
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      image: image || undefined,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }
    toast.success("Account created. Please log in.");
    router.push("/login");
  };

  return (
    <section className="mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-box border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="mb-1 text-3xl font-bold">Create your account</h1>
        <p className="mb-6 text-sm opacity-70">
          Join StudioSpace to book studios or host your own space.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Full name</span>
            <input name="name" required placeholder="Your name" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Photo URL</span>
            <input name="image" type="url" placeholder="https://example.com/photo.jpg" className="input input-bordered w-full" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Password</span>
            <input
              name="password"
              type="password"
              required
              placeholder="Min 6 characters, upper and lower case"
              className={`input input-bordered w-full ${passwordError ? "input-error" : ""}`}
            />
            {passwordError && <span className="mt-1 block text-sm text-error">{passwordError}</span>}
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner" /> : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}