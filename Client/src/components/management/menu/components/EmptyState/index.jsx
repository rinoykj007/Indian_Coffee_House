import React from "react";
import { Coffee } from "lucide-react";

export const EmptyState = ({ searchQuery }) => {
  return (
    <div className="text-center py-12">
      <Coffee className="w-16 h-16 text-slate-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-slate-800 mb-2">
        No items found
      </h3>
      <p className="text-slate-600">
        {searchQuery
          ? `No menu items match "${searchQuery}"`
          : "No menu items found in this category."}
      </p>
    </div>
  );
};
