"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import Logo from "./Logo";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const socials = [
  { label: "X", href: "https://x.com", icon: FaXTwitter },
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "YouTube", href: "https://youtube.com", icon: FaYoutube },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    toast.success("You're subscribed. New studio drops are heading your way.");
    setEmail("");
  };

  return (
    <footer className="border-t border-base-300 bg-base-200">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo />
          <p className="text-sm leading-relaxed opacity-70">
            StudioSpace connects creators with verified studio hosts, so a
            photographer, podcaster, or filmmaker can book the right room by the
            hour with clear pricing.
          </p>
          <div className="flex gap-2">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-circle btn-sm btn-outline"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h6 className="mb-4 font-bold">Quick Links</h6>
          <ul className="space-y-2 text-sm opacity-80">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6 className="mb-4 font-bold">Popular Categories</h6>
          <ul className="space-y-2 text-sm opacity-80">
            {categories.map((c) => (
              <li key={c}>
                <Link
                  href={`/studios?category=${encodeURIComponent(c)}`}
                  className="hover:text-primary"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h6 className="mb-4 font-bold">Newsletter</h6>
          <p className="mb-3 text-sm opacity-70">
            Get new studio listings and booking tips once a month.
          </p>
          <form onSubmit={handleSubscribe} className="join w-full">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input input-bordered join-item w-full"
            />
            <button type="submit" className="btn btn-primary join-item">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-base-300">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs opacity-70 sm:flex-row">
          <p>© {new Date().getFullYear()} StudioSpace. All rights reserved.</p>
          <p>
            By using StudioSpace you agree to our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </footer>
  );
}