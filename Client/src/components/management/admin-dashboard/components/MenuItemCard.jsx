import React from "react";
import { Button } from "./ui/Button";

export const MenuItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden flex flex-col">
      <div className="h-40 overflow-hidden relative">
        <img
          src={item.image || "https://via.placeholder.com/400x300?text=Menu+Item"}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {item.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-slate-800 text-lg">{item.name}</h3>
          <p className="text-lg font-bold text-amber-600">€{item.price}</p>
        </div>

        <div className="flex items-center mb-2 space-x-2">
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {item.type}
          </span>
          <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
            {item.category || "Uncategorized"}
          </span>
        </div>

        <div className="flex items-center mb-2 text-sm text-slate-600">
          <div className="flex items-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-yellow-500 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
            <span>
              {item.rating} ({item.reviewCount} reviews)
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-600 mt-2 mb-3 line-clamp-2 flex-1">
          {item.description}
        </p>

        <div className="flex justify-end space-x-2 mt-3 pt-3 border-t border-gray-200">
          <Button variant="infoLight" size="sm" onClick={() => onEdit(item)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => onDelete(item._id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};
