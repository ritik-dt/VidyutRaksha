import React from 'react';

export default function DashboardEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-4xl mb-3">📊</div>

      <div className="text-[14px] font-semibold mb-1">
        No data available
      </div>

      <div
        className="text-[12px]"
        style={{ color: 'hsl(var(--muted-foreground))' }}
      >
        Connect a DISCOM data source to start seeing dashboard metrics.
      </div>
    </div>
  );
}