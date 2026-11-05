import PrivateRoute from "@/components/PrivateRoute";
import SavedStudios from "@/components/SavedStudios";

export const metadata = { title: "Saved Studios | StudioSpace" };

export default function WishlistPage() {
  return (
    <PrivateRoute>
      <SavedStudios />
    </PrivateRoute>
  );
}