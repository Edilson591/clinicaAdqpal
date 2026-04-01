interface FieldSkeletonProps {
  tall?: boolean;
}

export function FieldSkeleton({ tall = false }: FieldSkeletonProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="h-4 w-24 bg-[#E2E8F0] rounded animate-pulse" />
      <div
        className={`w-full bg-[#E2E8F0] rounded-lg animate-pulse ${tall ? "h-24" : "h-14"}`}
      />
    </div>
  );
}
