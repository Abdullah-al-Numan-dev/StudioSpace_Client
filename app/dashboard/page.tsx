import DashboardView from "@/components/DashboardView";
import PrivateRoute from "@/components/PrivateRoute";

export const metadata = { title: "Dashboard | StudioSpace" };

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <DashboardView />
    </PrivateRoute>
  );
}