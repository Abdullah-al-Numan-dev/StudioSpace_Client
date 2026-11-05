import PrivateRoute from "@/components/PrivateRoute";
import StudioForm from "@/components/StudioForm";

export const metadata = { title: "Add New Studio | StudioSpace" };

export default function AddStudioPage() {
  return (
    <PrivateRoute>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">Add a New Studio</h1>
        <p className="mb-8 mt-2 opacity-70">
          Tell creators what your space offers, and start taking bookings.
        </p>
        <StudioForm />
      </section>
    </PrivateRoute>
  );
}