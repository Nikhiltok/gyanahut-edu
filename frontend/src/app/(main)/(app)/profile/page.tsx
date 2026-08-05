"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

import { AvatarUpload } from "@/components/common/AvatarUpload";
import { PageHeader } from "@/components/common/PageHeader";
import { TargetExamMultiSelect } from "@/components/exam/TargetExamMultiSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  changePassword,
  getProfile,
  sendEmailOtp,
  updateProfile,
  updateProfileAvatar,
  verifyEmailOtp,
} from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/api-error";
import type { Profile } from "@/types/auth";

const GENDER_ITEMS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

function toFormState(profile: Profile) {
  return {
    firstName: profile.first_name,
    lastName: profile.last_name,
    phone: profile.phone,
    state: profile.state,
    city: profile.city,
    dateOfBirth: profile.date_of_birth ?? "",
    gender: profile.gender ?? "",
    education: profile.education ?? "",
    targetExams: profile.target_exams.map((e) => e.id),
  };
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useQuery({ queryKey: ["profile"], queryFn: getProfile });

  return (
    <div className="w-full space-y-6 p-8">
      <PageHeader title="Profile" subtitle="Manage your account details and security." />
      {isLoading || !profile ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <ProfileForm profile={profile} onInvalidate={() => queryClient.invalidateQueries({ queryKey: ["profile"] })} />
      )}
    </div>
  );
}

function ProfileForm({ profile, onInvalidate }: { profile: Profile; onInvalidate: () => void }) {
  const [form, setForm] = useState(toFormState(profile));
  const [otpSent, setOtpSent] = useState(false);
  const [code, setCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const avatarMutation = useMutation({
    mutationFn: (file: File) => updateProfileAvatar(file),
    onSuccess: () => {
      toast.success("Profile photo updated");
      onInvalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not upload photo")),
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      updateProfile({
        first_name: form.firstName,
        last_name: form.lastName,
        phone: form.phone,
        state: form.state,
        city: form.city,
        date_of_birth: form.dateOfBirth || null,
        gender: form.gender,
        education: form.education,
        target_exams: form.targetExams,
      }),
    onSuccess: () => {
      toast.success("Profile updated");
      onInvalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not update your profile")),
  });

  const sendOtpMutation = useMutation({
    mutationFn: sendEmailOtp,
    onSuccess: (data) => {
      setDevOtp(data.debug_otp ?? null);
      setOtpSent(true);
      toast.success("Verification code sent to your email");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const verifyMutation = useMutation({
    mutationFn: () => verifyEmailOtp(code),
    onSuccess: () => {
      toast.success("Email verified successfully");
      setOtpSent(false);
      setCode("");
      onInvalidate();
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword({ old_password: oldPassword, new_password: newPassword }),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error) => toast.error(getApiErrorMessage(error, "Could not change your password")),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:text-left">
          <AvatarUpload
            name={profile.name}
            imageUrl={profile.profile_image}
            onUpload={(file) => avatarMutation.mutate(file)}
            isUploading={avatarMutation.isPending}
          />
          <div>
            <h2 className="font-heading text-lg font-semibold">{profile.name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant={profile.email_verified ? "default" : "secondary"}>
                Email {profile.email_verified ? "Verified" : "Unverified"}
              </Badge>
              <Badge variant={profile.phone_verified ? "default" : "secondary"}>
                Phone {profile.phone_verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input
              id="first-name"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input
              id="last-name"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm((f) => ({ ...f, dateOfBirth: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              items={GENDER_ITEMS}
              value={form.gender}
              onValueChange={(v) => setForm((f) => ({ ...f, gender: v ?? "" }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDER_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              value={form.education}
              onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              value={form.state}
              onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Target Exam(s)</Label>
            <TargetExamMultiSelect
              value={form.targetExams}
              onChange={(ids) => setForm((f) => ({ ...f, targetExams: ids }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-[#721315] hover:opacity-90 sm:w-auto"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {!profile.email_verified && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Verify your email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!otpSent ? (
              <Button onClick={() => sendOtpMutation.mutate()} disabled={sendOtpMutation.isPending}>
                {sendOtpMutation.isPending ? "Sending..." : "Send Verification Code"}
              </Button>
            ) : (
              <>
                {devOtp && (
                  <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground">
                    Dev mode (no SMTP configured) — your code is <span className="font-mono">{devOtp}</span>
                  </p>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email-otp">Verification Code</Label>
                  <Input
                    id="email-otp"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => verifyMutation.mutate()} disabled={verifyMutation.isPending || !code}>
                    {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
                  </Button>
                  <Button variant="outline" onClick={() => sendOtpMutation.mutate()} disabled={sendOtpMutation.isPending}>
                    Resend Code
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="old-password">Current password</Label>
            <PasswordInput
              id="old-password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <PasswordInput
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <PasswordInput
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-destructive">New password and confirmation do not match.</p>
          )}
          <Button
            variant="outline"
            disabled={
              !oldPassword ||
              !newPassword ||
              newPassword !== confirmPassword ||
              changePasswordMutation.isPending
            }
            onClick={() => changePasswordMutation.mutate()}
          >
            {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
