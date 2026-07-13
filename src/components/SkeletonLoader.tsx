/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#F5F1EA] overflow-hidden shadow-sm animate-pulse">
      <div className="h-56 bg-gray-100 w-full"></div>
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-100 rounded-md w-1/3"></div>
          <div className="h-4 bg-gray-100 rounded-md w-1/6"></div>
        </div>
        <div className="h-6 bg-gray-100 rounded-md w-3/4"></div>
        <div className="h-4 bg-gray-100 rounded-md w-5/6"></div>
        <div className="h-4 bg-gray-100 rounded-md w-1/2"></div>
        <div className="pt-3 flex justify-between items-center">
          <div className="h-6 bg-gray-100 rounded-md w-1/4"></div>
          <div className="h-10 bg-gray-100 rounded-full w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonMenu() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex space-x-4 p-4 border border-[#F5F1EA] rounded-xl bg-white">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-100 rounded w-1/3"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
            <div className="h-3 bg-gray-100 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
