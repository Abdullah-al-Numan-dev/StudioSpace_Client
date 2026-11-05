import { Suspense } from "react";
import ExploreStudios from "@/components/ExploreStudios";
import Loader from "@/components/Loader";

export const metadata = { title: "Explore Studios | StudioSpace" };

export default function StudiosPage() {
  return (
    <Suspense fallback={<Loader label="Loading studios" />}>
      <ExploreStudios />
    </Suspense>
  );
}