import MyBookings from "@/components/MyBookings";
import PrivateRoute from "@/components/PrivateRoute";

export const metadata = { title: "My Bookings | StudioSpace" };

export default function MyBookingsPage() {
  return (
    <PrivateRoute>
      <MyBookings />
    </PrivateRoute>
  );
}