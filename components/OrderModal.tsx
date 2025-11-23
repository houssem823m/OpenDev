"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import OrderForm from "./OrderForm";
import { createOrder } from "@/services/api";
import { Service } from "@/types";

interface OrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
}

export default function OrderModal({ open, onOpenChange, service }: OrderModalProps) {
  const handleSubmit = async (data: any) => {
    await createOrder(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Commander: {service.title}</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour commander ce service.
          </DialogDescription>
        </DialogHeader>
        <OrderForm serviceId={service._id} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

