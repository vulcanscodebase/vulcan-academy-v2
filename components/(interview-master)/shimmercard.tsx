"use client";

import { Shimmer } from "./shimmer";

export function ShimmerCard() {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow bg-white dark:bg-gray-900 w-full max-w-sm space-y-3">
      <Shimmer type="image" height="180px" />
      <Shimmer type="text" width="80%" />
      <Shimmer type="text" width="70%" />
      <Shimmer type="button" width="100%" height="40px" />
    </div>
  );
}
