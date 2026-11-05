import MyListings from "@/components/MyListings";
import PrivateRoute from "@/components/PrivateRoute";

export const metadata = { title: "My Studio Listings | StudioSpace" };

export default function MyListingsPage() {
  return (
    <PrivateRoute>
      <MyListings />
    </PrivateRoute>
  );
}