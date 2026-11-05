export default function StudioSkeleton() {
  return (
    <div className="h-full overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton mt-4 h-8 w-full" />
      </div>
    </div>
  );
}