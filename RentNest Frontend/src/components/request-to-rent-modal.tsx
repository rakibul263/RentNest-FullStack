"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CalendarDays, MessageSquareText } from "lucide-react";
import { rentalApi } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const schema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    message: z
      .string()
      .max(500, "Message cannot exceed 500 characters")
      .optional(),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type FormValues = z.infer<typeof schema>;

export function RequestToRentModal({
  open,
  onClose,
  propertyId,
  propertyTitle,
}: {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: rentalApi.create,
    onSuccess: (res) => {
      toast.success(res.message || "Rental request submitted!");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      reset();
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (values: FormValues) => {
    if (!user) {
      onClose();
      router.push(`/auth/login?next=/properties/${propertyId}`);
      return;
    }
    if (user.role !== "tenant") {
      toast.error("Only tenants can submit rental requests");
      return;
    }
    mutation.mutate({ propertyId, ...values });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request to Rent"
      description={propertyTitle}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Move-in date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                min={new Date().toISOString().split("T")[0]}
                {...register("startDate")}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-xs text-danger">{errors.startDate.message}</p>
            )}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Move-out date
            </label>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10"
                min={new Date().toISOString().split("T")[0]}
                {...register("endDate")}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-xs text-danger">{errors.endDate.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            Message to landlord <span className="text-muted-foreground">(optional)</span>
          </label>
          <div className="relative">
            <MessageSquareText className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <Textarea
              className="pl-10"
              placeholder="Tell the landlord a bit about yourself…"
              {...register("message")}
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
