import React from "react";
import { MenuCard } from "../MenuCard";

export const MenuGrid = ({ menuItems, orderItems, addToOrder, removeFromOrder }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {menuItems.map((item) => {
        const orderItem = orderItems.find(
          (orderItem) => orderItem._id === item._id
        );
        const quantity = orderItem ? orderItem.quantity : 0;

        return (
          <MenuCard
            key={item._id}
            item={item}
            quantity={quantity}
            addToOrder={addToOrder}
            removeFromOrder={removeFromOrder}
          />
        );
      })}
    </div>
  );
};
