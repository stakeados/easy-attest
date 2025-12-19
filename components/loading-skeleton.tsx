export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-shimmer rounded ${className}`} aria-label="Loading..." />
  );
}

export function AttestationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <LoadingSkeleton className="h-6 w-48" />
          <LoadingSkeleton className="h-5 w-20" />
        </div>

        {/* Content */}
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-4 w-5/6" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

export function SchemaCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-fade-in">
      <div className="space-y-4">
        {/* Title */}
        <LoadingSkeleton className="h-7 w-56" />

        {/* Description */}
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-2/3" />

        {/* Fields */}
        <div className="space-y-2 pt-2">
          <LoadingSkeleton className="h-3 w-40" />
          <div className="flex gap-2">
            <LoadingSkeleton className="h-6 w-24" />
            <LoadingSkeleton className="h-6 w-28" />
            <LoadingSkeleton className="h-6 w-20" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-9 w-28" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tabs skeleton */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <LoadingSkeleton className="h-10 w-40" />
        <LoadingSkeleton className="h-10 w-40" />
      </div>

      {/* Filters skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <LoadingSkeleton className="h-10 w-full sm:w-64" />
        <LoadingSkeleton className="h-10 w-full sm:w-48" />
      </div>

      {/* Cards skeleton */}
      <div className="space-y-4">
        <AttestationCardSkeleton />
        <AttestationCardSkeleton />
        <AttestationCardSkeleton />
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <LoadingSkeleton className="h-8 w-64" />

      {/* Form fields */}
      <div className="space-y-4">
        <div>
          <LoadingSkeleton className="h-5 w-32 mb-2" />
          <LoadingSkeleton className="h-11 w-full" />
        </div>
        <div>
          <LoadingSkeleton className="h-5 w-40 mb-2" />
          <LoadingSkeleton className="h-11 w-full" />
        </div>
        <div>
          <LoadingSkeleton className="h-5 w-36 mb-2" />
          <LoadingSkeleton className="h-11 w-full" />
        </div>
      </div>

      {/* Button */}
      <LoadingSkeleton className="h-12 w-full sm:w-40" />
    </div>
  );
}
