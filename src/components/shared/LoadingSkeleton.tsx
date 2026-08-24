import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("skeleton", className)}
      style={style}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton style={{ width: 48, height: 48, borderRadius: "var(--radius-md)" }} />
        <div className="flex-1 space-y-2">
          <Skeleton style={{ height: 14, width: "60%" }} />
          <Skeleton style={{ height: 12, width: "40%" }} />
        </div>
      </div>
      <Skeleton style={{ height: 12, width: "100%" }} />
      <Skeleton style={{ height: 12, width: "80%" }} />
    </div>
  );
}

export function MedicineCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex gap-3">
        <Skeleton style={{ width: 60, height: 60, borderRadius: "var(--radius-md)" }} />
        <div className="flex-1 space-y-2">
          <Skeleton style={{ height: 16, width: "70%" }} />
          <Skeleton style={{ height: 12, width: "50%" }} />
          <Skeleton style={{ height: 12, width: "40%" }} />
        </div>
      </div>
    </div>
  );
}

export function ReminderCardSkeleton() {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <Skeleton style={{ width: 44, height: 44, borderRadius: "50%" }} />
        <div className="flex-1 space-y-2">
          <Skeleton style={{ height: 14, width: "55%" }} />
          <Skeleton style={{ height: 12, width: "35%" }} />
        </div>
        <Skeleton style={{ width: 80, height: 34, borderRadius: "var(--radius-full)" }} />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-5 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton style={{ height: 12, width: 100 }} />
          <Skeleton style={{ height: 20, width: 180 }} />
        </div>
        <Skeleton style={{ width: 44, height: 44, borderRadius: "50%" }} />
      </div>

      {/* Adherence card */}
      <Skeleton style={{ height: 100, borderRadius: "var(--radius-lg)" }} />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Skeleton style={{ height: 80, borderRadius: "var(--radius-lg)" }} />
        <Skeleton style={{ height: 80, borderRadius: "var(--radius-lg)" }} />
      </div>

      {/* Reminders */}
      <div className="space-y-3">
        <Skeleton style={{ height: 14, width: 120 }} />
        <ReminderCardSkeleton />
        <ReminderCardSkeleton />
      </div>

      {/* Medicines */}
      <div className="space-y-3">
        <Skeleton style={{ height: 14, width: 130 }} />
        <MedicineCardSkeleton />
        <MedicineCardSkeleton />
      </div>
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={`flex gap-3 ${i % 2 === 1 ? "flex-row-reverse" : ""}`}
        >
          {i % 2 === 0 && (
            <Skeleton style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
          )}
          <Skeleton
            style={{
              height: 64,
              width: "75%",
              borderRadius: "var(--radius-lg)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
