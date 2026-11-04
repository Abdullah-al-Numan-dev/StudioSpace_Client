"use client";

import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { FiMenu } from "react-icons/fi";
import { toast } from "sonner";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useEffect } from "react";


const links = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
];

const userLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/add-studio", label: "Add New Studio" },
  { href: "/my-listings", label: "My Studio Listings" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  // Keep the HttpOnly JWT cookie in sync with the Better Auth session
  useEffect(() => {
    if (user?.id) {
      fetch("/api/token", { method: "POST" }).catch(() => { });
    }
  }, [user?.id]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = async () => {
    await fetch("/api/token", { method: "DELETE" });
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur">
      <div className="navbar mx-auto max-w-7xl px-4">
        {/* Left: mobile menu + logo */}
        <div className="navbar-start gap-1">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <FiMenu size={22} />
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow-lg border border-base-300"
            >
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={isActive(l.href) ? "menu-active" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        {/* Center: desktop links */}
        <nav className="navbar-center hidden lg:flex">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors hover:text-primary ${isActive(l.href) ? "text-primary" : ""
                    }`}
                >
                  {l.label}
                  {isActive(l.href) && (
                    <span className="absolute inset-x-4 -bottom-[13px] h-0.5 rounded bg-primary" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right: theme + auth */}
        <div className="navbar-end gap-2">
          <ThemeToggle />

          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-base-300" />
          ) : !user ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-ghost btn-sm sm:btn-md">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm sm:btn-md">
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end dropdown-hover">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content z-10 mt-1 w-64 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg"
              >
                <li className="pointer-events-none px-3 py-2">
                  <span className="font-bold">{user.name}</span>
                  <span className="text-xs opacity-60">{user.email}</span>
                </li>
                <div className="divider my-0" />
                {userLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
                <div className="divider my-0" />
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}