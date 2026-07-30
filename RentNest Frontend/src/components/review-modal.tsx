"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { reviewApi } from "@/lib/api";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/ui/rating-stars";

const schema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  comment: z.string().max(1000, "Comment is too long").optional(),
});

type FormValues = z.infer<typeof schema>;

export function ReviewModal({
  open,
  onClose,
  propertyId,
  rentalRequestId,
  propertyTitle,
}: {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  rentalRequestId: string;
  propertyTitle: string;
}) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 5 },
  });

  const rating = useWatch({ control, name: "rating" });

  const mutation = useMutation({
    mutationFn: reviewApi.create,
    onSuccess: (res) => {
      toast.success(res.message || "Review submitted. Thank you!");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      onClose();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      propertyId,
      rentalRequestId,
      rating: values.rating,
      comment: values.comment || undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title="Leave a review" description={propertyTitle}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex flex-col items-center rounded-2xl bg-muted/60 py-6">
          <p className="mb-2 text-sm font-semibold text-foreground">
            How was your stay?
          </p>
          <RatingStars
            value={rating}
            onChange={(v) => setValue("rating", v)}
            size={32}
          />
          {errors.rating && (
            <p className="mt-2 text-xs text-danger">{errors.rating.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-foreground">
            Your review <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            placeholder="Share your experience — the good and the not-so-good…"
            onChange={(e) => setValue("comment", e.target.value)}
          />
          {errors.comment && (
            <p className="mt-1 text-xs text-danger">{errors.comment.message}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
}
