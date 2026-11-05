import type { Booking } from "@/lib/types";

const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtDate = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export async function downloadInvoice(b: Booking) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const invoiceNo = `SS-${b._id.slice(-8).toUpperCase()}`;
  const subtotal = b.hours * b.hourlyRate;

  // Header band
  doc.setFillColor(88, 80, 236);
  doc.rect(0, 0, W, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("StudioSpace", M, 52);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Booking Receipt", W - M, 52, { align: "right" });

  // Invoice meta
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE NO", M, 130);
  doc.text("ISSUED", M + 170, 130);
  doc.text("STATUS", M + 340, 130);
  doc.setFont("helvetica", "normal");
  doc.text(invoiceNo, M, 146);
  doc.text(new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), M + 170, 146);
  doc.text(b.status, M + 340, 146);

  // Parties
  doc.setFont("helvetica", "bold");
  doc.text("BILLED TO", M, 190);
  doc.text("HOSTED BY", W / 2, 190);
  doc.setFont("helvetica", "normal");
  doc.text(b.userName, M, 206);
  doc.text(b.userEmail, M, 220);
  doc.text(b.ownerEmail, W / 2, 206);

  // Booking details
  doc.setDrawColor(210, 210, 210);
  doc.line(M, 246, W - M, 246);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(b.studioTitle, M, 272);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(fmtDate(b.date), M, 292);
  doc.text(`${fmtTime(b.startTime)} to ${fmtTime(b.endTime)}  (${b.hours} ${b.hours === 1 ? "hour" : "hours"})`, M, 308);
  doc.text(`${b.guests} ${b.guests === 1 ? "guest" : "guests"}`, M, 324);

  // Table header
  let y = 360;
  doc.setFillColor(243, 243, 247);
  doc.rect(M, y - 16, W - M * 2, 26, "F");
  doc.setFont("helvetica", "bold");
  doc.text("Description", M + 10, y);
  doc.text("Rate", W - M - 170, y, { align: "right" });
  doc.text("Hours", W - M - 100, y, { align: "right" });
  doc.text("Amount", W - M - 10, y, { align: "right" });

  // Table row
  y += 32;
  doc.setFont("helvetica", "normal");
  doc.text("Studio rental", M + 10, y);
  doc.text(`$${b.hourlyRate.toFixed(2)}`, W - M - 170, y, { align: "right" });
  doc.text(String(b.hours), W - M - 100, y, { align: "right" });
  doc.text(`$${subtotal.toFixed(2)}`, W - M - 10, y, { align: "right" });
  doc.line(M, y + 14, W - M, y + 14);

  // Totals
  y += 44;
  doc.text("Session total", W - M - 150, y);
  doc.setFont("helvetica", "bold");
  doc.text(`$${b.totalPrice.toFixed(2)}`, W - M - 10, y, { align: "right" });

  y += 22;
  doc.setFont("helvetica", "normal");
  doc.text("Security deposit (refundable)", W - M - 150, y);
  doc.text(`$${b.securityDeposit.toFixed(2)}`, W - M - 10, y, { align: "right" });

  // Notes
  doc.setFontSize(9);
  doc.setTextColor(110, 110, 110);
  doc.text(
    "The security deposit is held by the host and returned after the session if the space is left in good condition.",
    M,
    y + 60,
    { maxWidth: W - M * 2 }
  );
  doc.text("Thank you for booking with StudioSpace.", M, y + 90);

  doc.save(`StudioSpace-Invoice-${invoiceNo}.pdf`);
}