"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

type Props = {
  studioId: string;
  title: string;
  hourlyRate: number;
  securityDeposit: number;
  ownerEmail: string;
};

export default function BookingButton({ studioId, title, hourlyRate, securityDeposit, ownerEmail }: Props) {
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

      <dialog ref={dialogRef} className="modal" data-studio-id={studioId}>
        <div className="modal-box">
          <h3 className="text-xl font-bold">Book {title}</h3>
          <p className="mt-2 text-sm opacity-70">
            ${hourlyRate} / hr with a ${securityDeposit} refundable security deposit.
          </p>
          <div className="mt-4 rounded-box bg-base-200 p-4 text-sm">
            Date and time selection arrives in the next step.
          </div>
          <div className="modal-action">
            <button type="button" className="btn" onClick={() => dialogRef.current?.close()}>
              Close
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="Close">close</button>
        </form>
      </dialog>
    </>
  );
}