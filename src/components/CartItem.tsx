import React from "react";
import { motion } from "motion/react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { ICartItem } from "@/src/types";
import { Button } from "@/components/ui/button";

interface CartItemProps {
  item: ICartItem;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

export const CartProductItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex items-center gap-6 py-8 border-b border-border group last:border-none"
    >
      <div className="relative w-[120px] h-[160px] overflow-hidden bg-[#1A1A1A] border border-border flex items-center justify-center">
        <img
          src={item.image}
          alt={item.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="flex-1 min-w-0">
        {item.category === "Apparel" && (
          <span className="bg-accent text-white px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase mb-2 inline-block">
            Dòng sản phẩm đặc trưng
          </span>
        )}
        <h2 className="text-[1.5rem] font-heading font-normal leading-tight mb-2">
          {item.name}
        </h2>
        <p className="text-[0.85rem] text-muted-foreground mb-4">
          {item.description}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2.5">
        <div className="text-[1rem] font-extrabold text-accent">
          { (item.price * item.quantity).toLocaleString() } VNĐ
        </div>
        
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onUpdateQuantity(item.id, -1)}
            disabled={item.quantity <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-full border-1.5 border-border bg-background text-foreground hover:border-accent hover:text-accent transition-all disabled:opacity-30"
          >
            <Minus className="w-3 h-3" />
          </button>
          <input 
            type="text" 
            value={item.quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val) && val >= 1) {
                onUpdateQuantity(item.id, val - item.quantity);
              } else if (e.target.value === "") {
                onUpdateQuantity(item.id, 1 - item.quantity);
              }
            }}
            className="w-9 text-center font-bold text-[0.9rem] bg-transparent border-1.5 border-border rounded-md py-0.5 outline-none focus:text-accent"
          />
          <button
            onClick={() => onUpdateQuantity(item.id, 1)}
            className="w-7 h-7 flex items-center justify-center rounded-full border-1.5 border-border bg-background text-foreground hover:border-accent hover:text-accent transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="text-[#444] hover:text-accent transition-colors p-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
