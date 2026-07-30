"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, UploadCloud, X } from "lucide-react";
import { categoryApi, landlordApi } from "@/lib/api";
import { AMENITIES } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  categoryId: z.string().min(1, "Select a category"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  address: z.string().min(3, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  bedrooms: z.coerce.number().int().min(0, "Must be 0 or more"),
  bathrooms: z.coerce.number().int().min(0, "Must be 0 or more"),
  area: z.coerce.number().min(0, "Area must be positive"),
});

type FormInput = z.input<typeof schema>;
type FormOutput = z.output<typeof schema>;

function defaultValues(property?: Property): FormInput {
  return {
    title: property?.title ?? "",
    description: property?.description ?? "",
    categoryId: property?.categoryId ?? "",
    price: property?.price ?? 1000,
    address: property?.address ?? "",
    city: property?.city ?? "",
    state: property?.state ?? "",
    zipCode: property?.zipCode ?? "",
    bedrooms: property?.bedrooms ?? 1,
    bathrooms: property?.bathrooms ?? 1,
    area: property?.area ?? 50,
  };
}

export function PropertyForm({ property }: { property?: Property }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = !!property;

  const categories = useQuery({ queryKey: ["categories"], queryFn: categoryApi.list });

  const [amenities, setAmenities] = React.useState<string[]>(property?.amenities ?? []);
  const [images, setImages] = React.useState<string[]>(property?.images ?? []);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isAvailable, setIsAvailable] = React.useState(property?.isAvailable ?? true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues(property),
  });

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      isEdit
        ? landlordApi.updateProperty(property.id, payload)
        : landlordApi.createProperty(payload),
    onSuccess: (res) => {
      toast.success(res.message || (isEdit ? "Property updated" : "Property created"));
      queryClient.invalidateQueries({ queryKey: ["landlord-properties"] });
      router.push("/dashboard/landlord");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const toggleAmenity = (a: string) =>
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );

  const uploadImages = async (files: FileList | null) => {
    if (!files?.length) return;
    if (isUploading) return;
    setIsUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.set("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? "Upload failed");
          continue;
        }
        setImages((prev) => [...prev, data.url]);
      }
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (values: FormOutput) => {
    mutation.mutate({
      ...values,
      price: String(values.price),
      bedrooms: String(values.bedrooms),
      bathrooms: String(values.bathrooms),
      area: String(values.area),
      amenities,
      images,
      isAvailable,
      state: values.state || undefined,
      zipCode: values.zipCode || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Title</label>
            <Input placeholder="e.g. Modern 2BR Apartment with Skyline View" {...register("title")} />
            {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Description</label>
            <Textarea
              rows={5}
              placeholder="Describe the property, neighborhood, and what makes it special…"
              {...register("description")}
            />
            {errors.description && <p className="mt-1 text-xs text-danger">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Monthly Price ($)</label>
              <Input type="number" min={0} {...register("price")} />
              {errors.price && <p className="mt-1 text-xs text-danger">{errors.price.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Category</label>
              {categories.isLoading ? (
                <Skeleton className="h-11 w-full" />
              ) : (
                <Select {...register("categoryId")}>
                  <option value="">Select category…</option>
                  {categories.data?.data?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              )}
              {errors.categoryId && <p className="mt-1 text-xs text-danger">{errors.categoryId.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Bedrooms</label>
              <Input type="number" min={0} {...register("bedrooms")} />
              {errors.bedrooms && <p className="mt-1 text-xs text-danger">{errors.bedrooms.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Bathrooms</label>
              <Input type="number" min={0} {...register("bathrooms")} />
              {errors.bathrooms && <p className="mt-1 text-xs text-danger">{errors.bathrooms.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Area (m²)</label>
              <Input type="number" min={0} {...register("area")} />
              {errors.area && <p className="mt-1 text-xs text-danger">{errors.area.message}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Street Address</label>
            <Input placeholder="123 Main Street" {...register("address")} />
            {errors.address && <p className="mt-1 text-xs text-danger">{errors.address.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">City</label>
              <Input placeholder="Mirpur-13, Dhaka" {...register("city")} />
              {errors.city && <p className="mt-1 text-xs text-danger">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">State</label>
              <Input placeholder="NY" {...register("state")} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">ZIP</label>
              <Input placeholder="10001" {...register("zipCode")} />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="mb-2 block text-sm font-semibold">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    amenities.includes(a)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <label className="mb-2 block text-sm font-semibold">Images</label>
            <label
              className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors ${
                isUploading
                  ? "border-primary/40 bg-primary/5 opacity-70"
                  : "border-border hover:border-primary/40 hover:bg-primary/5"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={isUploading}
                onChange={(e) => {
                  uploadImages(e.target.files);
                  e.target.value = "";
                }}
              />
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <UploadCloud className="h-6 w-6 text-muted-foreground" />
              )}
              <span className="text-sm font-semibold">
                {isUploading ? "Uploading…" : "Click to upload images"}
              </span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG or WebP. Images are stored on Cloudinary.
              </span>
            </label>
            {images.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <span key={i} className="group relative h-16 w-16 overflow-hidden rounded-xl border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`Image ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, x) => x !== i))}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-border bg-card p-4">
            <div>
              <p className="text-sm font-bold">List as available</p>
              <p className="text-xs text-muted-foreground">
                Tenants can request to rent this property immediately.
              </p>
            </div>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-5 w-5 accent-primary"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/landlord")}>
          Cancel
        </Button>
        <Button type="submit" size="lg" loading={mutation.isPending}>
          {isEdit ? "Save Changes" : "Create Property"}
        </Button>
      </div>
    </form>
  );
}
