import React from "react";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Textarea } from "./ui/Textarea";
import { Button } from "./ui/Button";

const typeOptions = [
  { value: "", label: "Select Type" },
  { value: "appetizer", label: "Appetizer" },
  { value: "main", label: "Main Course" },
  { value: "dessert", label: "Dessert" },
  { value: "beverage", label: "Beverage" },
  { value: "snack", label: "Snack" },
];

const categoryOptions = [
  { value: "", label: "Select Category" },
  { value: "South Varieties (Dosa)", label: "South Varieties (Dosa)" },
  { value: "Snacks", label: "Snacks" },
  { value: "Beverages", label: "Beverages" },
  { value: "Meals", label: "Meals" },
];

export const MenuItemForm = ({
  item,
  onChange,
  onSubmit,
  onCancel,
  submitText = "Save Item",
  submitVariant = "primary",
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Name"
        id="name"
        type="text"
        value={item.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />
      <Select
        label="Type"
        id="type"
        value={item.type}
        onChange={(e) => onChange("type", e.target.value)}
        options={typeOptions}
        required
      />
      <Input
        label="Price (€)"
        id="price"
        type="number"
        value={item.price}
        onChange={(e) => onChange("price", e.target.value)}
        required
      />
      <Input
        label="Image URL"
        id="image"
        type="text"
        value={item.image}
        onChange={(e) => onChange("image", e.target.value)}
        required
      />
      <Select
        label="Category"
        id="category"
        value={item.category}
        onChange={(e) => onChange("category", e.target.value)}
        options={categoryOptions}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Rating (1-5)"
          id="rating"
          type="number"
          min="1"
          max="5"
          step="0.1"
          value={item.rating}
          onChange={(e) => onChange("rating", e.target.value)}
          required
        />
        <Input
          label="Review Count"
          id="reviewCount"
          type="number"
          min="0"
          value={item.reviewCount}
          onChange={(e) => onChange("reviewCount", e.target.value)}
          required
        />
      </div>
      <Textarea
        label="Description"
        id="description"
        value={item.description}
        onChange={(e) => onChange("description", e.target.value)}
        rows="3"
        required
      />
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="available"
          checked={item.available}
          onChange={(e) => onChange("available", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="available" className="text-sm text-slate-700">
          Available
        </label>
      </div>
      <div className="flex space-x-4">
        <Button type="submit" variant={submitVariant} size="flex">
          {submitText}
        </Button>
        <Button variant="secondary" size="flex" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
