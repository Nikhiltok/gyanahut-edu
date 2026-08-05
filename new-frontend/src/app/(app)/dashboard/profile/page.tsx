"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { TargetExamPicker } from "@/components/forms/TargetExamPicker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getErrorMessage } from "@/lib/api-error";
import { changePassword, getProfile, updateProfile } from "@/services/auth.service";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: getProfile, retry: false });

  const [details, setDetails] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    education: "",
    state: "",
    city: "",
    target_exams: [] as string[],
  });

  useEffect(() => {
    if (!profile) return;
    setDetails({
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      date_of_birth: profile.date_of_birth ?? "",
      gender: profile.gender ?? "",
      education: profile.education ?? "",
      state: profile.state,
      city: profile.city,
      target_exams: profile.target_exams.map((exam) => exam.id),
    });
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update profile.")),
  });

  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password updated.");
      setPasswords({ current: "", next: "", confirm: "" });
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not update password.")),
  });

  function handleSaveDetails(event: React.FormEvent) {
    event.preventDefault();
    updateMutation.mutate({
      ...details,
      date_of_birth: details.date_of_birth || null,
    });
  }

  function handleChangePassword(event: React.FormEvent) {
    event.preventDefault();
    if (passwords.next !== passwords.confirm) {
      toast.error("New password and confirmation don't match.");
      return;
    }
    passwordMutation.mutate({ old_password: passwords.current, new_password: passwords.next });
  }

  const initials = `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-4">
        <span className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-chip-bg font-heading text-base font-semibold text-chip-fg">
          {initials}
        </span>
        {profile && (
          <div className="flex gap-2">
            <span
              className={
                profile.email_verified
                  ? "rounded-[5px] bg-success-bg px-3 py-1 font-mono text-[11px] font-medium text-success-fg"
                  : "rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg"
              }
            >
              Email {profile.email_verified ? "verified" : "unverified"}
            </span>
            <span
              className={
                profile.phone_verified
                  ? "rounded-[5px] bg-success-bg px-3 py-1 font-mono text-[11px] font-medium text-success-fg"
                  : "rounded-[5px] bg-chip-bg px-3 py-1 font-mono text-[11px] font-medium text-chip-fg"
              }
            >
              Phone {profile.phone_verified ? "verified" : "unverified"}
            </span>
          </div>
        )}
      </div>

      <Card className="p-6">
        <h2 className="font-heading text-sm font-semibold text-fg">Personal details</h2>

        <form className="mt-4 space-y-4" onSubmit={handleSaveDetails}>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="First name"
              value={details.first_name}
              onChange={(e) => setDetails({ ...details, first_name: e.target.value })}
            />
            <Input
              placeholder="Last name"
              value={details.last_name}
              onChange={(e) => setDetails({ ...details, last_name: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={details.phone}
              onChange={(e) => setDetails({ ...details, phone: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="date"
              placeholder="Date of birth"
              value={details.date_of_birth}
              onChange={(e) => setDetails({ ...details, date_of_birth: e.target.value })}
            />
            <Select value={details.gender} onChange={(e) => setDetails({ ...details, gender: e.target.value })}>
              <option value="">Gender</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </Select>
            <Input
              placeholder="Education"
              value={details.education}
              onChange={(e) => setDetails({ ...details, education: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Input
              placeholder="State"
              value={details.state}
              onChange={(e) => setDetails({ ...details, state: e.target.value })}
            />
            <Input
              placeholder="City"
              value={details.city}
              onChange={(e) => setDetails({ ...details, city: e.target.value })}
            />
            <TargetExamPicker
              value={details.target_exams}
              onChange={(target_exams) => setDetails({ ...details, target_exams })}
            />
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="font-heading text-sm font-semibold text-fg">Change password</h2>

        <form className="mt-4 space-y-4" onSubmit={handleChangePassword}>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="New password"
              value={passwords.next}
              onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              required
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              required
            />
          </div>

          <Button type="submit" disabled={passwordMutation.isPending}>
            {passwordMutation.isPending ? "Updating..." : "Update password"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
