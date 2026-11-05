"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import BookingForm from "./BookingForm";

type Props = {
  studioId: string;
  title: string;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  ownerEmail: string;
};

export default function BookingButton({
  studioId,
  title,
  hourlyRate,
  securityDeposit,
  maxCapacity,
  ownerEmail,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  const handleOpen = () => {
    if (!session) {
      toast.info("Please log in to book a studio");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (session.user.email === ownerEmail) {
      toast.error("You can't book your own studio");
      return;
    }
    dialogRef.current?.showModal();
  };

  return (
    <>
      <button type="button" onClick={handleOpen} className="btn btn-primary w-full">
        Book Workspace Now
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          <h3 className="text-xl font-bold">Book {title}</h3>
          <p className="mt-1 text-sm opacity-70">Minimum booking is one hour.</p>
          <BookingForm
            studioId={studioId}
            hourlyRate={hourlyRate}
            securityDeposit={securityDeposit}
            maxCapacity={maxCapacity}
            onClose={() => dialogRef.current?.close()}
          />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}