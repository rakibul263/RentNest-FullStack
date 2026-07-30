"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ShieldBan, ShieldCheck } from "lucide-react";
import type { AdminUser } from "@/lib/types";

export function UserBanButton({ user }: { user: AdminUser }) {
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = useMutation({
    mutationFn: () => adminApi.updateUserStatus(user.id, !user.isBanned),
    onSuccess: (res) => {
      toast.success(res.message || (user.isBanned ? "User unbanned" : "User banned"));
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setConfirmOpen(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (user.role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5" /> Protected
      </span>
    );
  }

  return (
    <>
      <Button
        size="sm"
        variant={user.isBanned ? "success" : "destructive"}
        className="gap-1.5"
        onClick={() => setConfirmOpen(true)}
        loading={mutation.isPending}
      >
        {user.isBanned ? (
          <>
            <ShieldCheck className="h-3.5 w-3.5" /> Unban
          </>
        ) : (
          <>
            <ShieldBan className="h-3.5 w-3.5" /> Ban
          </>
        )}
      </Button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title={user.isBanned ? "Unban this user?" : "Ban this user?"}
        description={`${user.name} (${user.email})`}
      >
        <p className="text-sm text-muted-foreground">
          {user.isBanned
            ? "Unbanning restores this user's access to the platform. They will be able to log in again."
            : "Banned users will be logged out immediately and blocked from logging back in. This action can be reversed anytime."}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            variant={user.isBanned ? "success" : "destructive"}
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            {user.isBanned ? "Unban user" : "Ban user"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
