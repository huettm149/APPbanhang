import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CreditCard, ShieldCheck, Send, RefreshCw, Tag, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CustomerInfo, DiscountCode, TaxConfig } from "@/src/types";

interface TaxInfo extends TaxConfig {
  amount: number;
}

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  taxes: TaxInfo[];
  customerInfo: CustomerInfo;
  discountCodes: DiscountCode[];
  appliedDiscount: DiscountCode | null;
  onCustomerInfoChange: (info: CustomerInfo) => void;
  onApplyDiscount: (code: DiscountCode | null) => void;
  onSendOrder: () => void;
  isSending: boolean;
}

export function CartSummary({ 
  subtotal, 
  shipping, 
  taxes, 
  customerInfo, 
  discountCodes,
  appliedDiscount,
  onCustomerInfoChange, 
  onApplyDiscount,
  onSendOrder,
  isSending 
}: CartSummaryProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");

  const discountAmount = useMemo(() => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.percent) {
      return (subtotal * appliedDiscount.percent) / 100;
    }
    if (appliedDiscount.amount) {
      return appliedDiscount.amount;
    }
    return 0;
  }, [appliedDiscount, subtotal]);

  const totalTax = useMemo(() => 
    taxes.reduce((acc, t) => acc + t.amount, 0),
    [taxes]
  );

  const finalTotal = subtotal + shipping + totalTax - discountAmount;

  const handleApplyCoupon = () => {
    const found = discountCodes.find(c => c.code.toUpperCase() === couponInput.toUpperCase());
    if (found) {
      onApplyDiscount(found);
      setCouponInput("");
      setCouponError("");
    } else {
      setCouponError("Mã giảm giá không hợp lệ");
    }
  };

  return (
    <div className="sticky top-8 space-y-6">
      <div className="bg-card border border-border rounded-[20px] p-7 shadow-sm">
        <h3 className="font-heading text-[1.1rem] font-bold mb-5 pb-3.5 border-b border-border">
          Thông tin giao hàng
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-[1px] font-bold opacity-50 mb-1.5 block">Họ và tên</label>
            <Input 
              value={customerInfo.fullName}
              onChange={(e) => onCustomerInfoChange({ ...customerInfo, fullName: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="h-10 text-sm bg-background border-border"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[1px] font-bold opacity-50 mb-1.5 block">Số điện thoại</label>
            <Input 
              value={customerInfo.phone}
              onChange={(e) => onCustomerInfoChange({ ...customerInfo, phone: e.target.value })}
              placeholder="0901234567"
              className="h-10 text-sm bg-background border-border"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[1px] font-bold opacity-50 mb-1.5 block">Địa chỉ giao hàng</label>
            <textarea 
              value={customerInfo.address}
              onChange={(e) => onCustomerInfoChange({ ...customerInfo, address: e.target.value })}
              placeholder="Số 1, Đường ABC, Quận X, TP. Y"
              className="w-full h-20 text-sm bg-background border border-border rounded-md p-3 outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[1px] font-bold opacity-50 mb-1.5 block">Ghi chú đơn hàng</label>
            <textarea 
              value={customerInfo.note}
              onChange={(e) => onCustomerInfoChange({ ...customerInfo, note: e.target.value })}
              placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi đến..."
              className="w-full h-20 text-sm bg-background border border-border rounded-md p-3 outline-none focus:ring-1 focus:ring-accent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-foreground text-background rounded-[20px] p-7 shadow-none">
        <h3 className="font-heading text-[1.3rem] mb-5 pb-3.5 border-b border-background/10">
          Tóm tắt đơn hàng
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-[0.9rem] font-medium">
            <span>Tạm tính</span>
            <span>{subtotal.toLocaleString()} VNĐ</span>
          </div>

          <div className="flex justify-between text-[0.8rem] italic opacity-60">
            <span>Tiền hàng (chưa giảm, chưa ship)</span>
            <span>{subtotal.toLocaleString()} VNĐ</span>
          </div>

          {/* Discount Section */}
          {!appliedDiscount ? (
            <div className="pt-2">
              <div className="flex gap-2">
                <Input 
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Mã giảm giá"
                  className="h-9 text-xs bg-background/10 border-background/20 text-background placeholder:text-background/40"
                />
                <Button 
                  onClick={handleApplyCoupon}
                  variant="outline"
                  size="sm"
                  className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider bg-background/10 border-background/20 hover:bg-background/20"
                >
                  Áp dụng
                </Button>
              </div>
              {couponError && <p className="text-[10px] text-accent mt-1.5 ml-1">{couponError}</p>}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center bg-background/10 p-2.5 rounded-lg border border-background/20"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{appliedDiscount.code}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold">-{discountAmount.toLocaleString()} VNĐ</span>
                <button 
                  onClick={() => onApplyDiscount(null)}
                  className="p-1 hover:bg-background/10 rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between text-[0.9rem] font-medium opacity-60">
            <span>Phí vận chuyển</span>
            <span>Tạm thời chưa tính</span>
          </div>

          {/* Taxes Section */}
          <div className="space-y-3 py-2 border-y border-background/5">
            {taxes.length > 0 ? (
              taxes.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center text-[0.85rem] font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-3 bg-accent/40 rounded-full" />
                    <span className="opacity-70">{t.name} ({t.rate}%)</span>
                  </div>
                  <span className="font-bold">{t.amount.toLocaleString()} VNĐ</span>
                </div>
              ))
            ) : (
              <div className="flex justify-between text-[0.9rem] font-medium opacity-60">
                <span>Thuế</span>
                <span>0 VNĐ</span>
              </div>
            )}
          </div>
          
          <div className="mt-6 border-t border-background/10 pt-5 flex justify-between items-end">
            <span className="text-[1.2rem] font-black">Tổng cộng</span>
            <span className="text-[1.2rem] font-black italic">{finalTotal.toLocaleString()} VNĐ</span>
          </div>
        </div>

        <Button 
          onClick={onSendOrder}
          disabled={isSending || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address}
          className="w-full h-[60px] rounded-xl bg-background hover:bg-background/90 text-foreground text-sm font-bold uppercase tracking-[2px] cursor-pointer flex items-center justify-center gap-2 shadow-xl"
        >
          {isSending ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {isSending ? "Đang gửi..." : "Gửi đơn hàng"}
        </Button>

        <p className="mt-4 text-[10px] opacity-40 text-center uppercase tracking-[2px]">
          Giá đã bao gồm thuế suất hiện hành
        </p>
      </div>
    </div>
  );
}
