"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export type FieldValue = string | number | boolean;

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface EntityFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  fields: FieldConfig[];
  initialValues?: Record<string, FieldValue | null | undefined>;
  onSubmit: (values: Record<string, FieldValue>) => Promise<void> | void;
  isSubmitting?: boolean;
}

function defaultValueFor(field: FieldConfig): FieldValue {
  if (field.type === "checkbox") return false;
  if (field.type === "number") return 0;
  return "";
}

export function EntityFormDialog({
  open,
  onOpenChange,
  title,
  fields,
  initialValues,
  onSubmit,
  isSubmitting,
}: EntityFormDialogProps) {
  // Callers remount this component (via a changing `key`) whenever the target
  // record changes, so a lazy initializer is enough — no effect-based sync needed.
  const [values, setValues] = useState<Record<string, FieldValue>>(() => {
    const initial: Record<string, FieldValue> = {};
    for (const field of fields) {
      initial[field.name] = (initialValues?.[field.name] as FieldValue) ?? defaultValueFor(field);
    }
    return initial;
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(values);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.type !== "checkbox" && <Label htmlFor={field.name}>{field.label}</Label>}

              {field.type === "text" && (
                <Input
                  id={field.name}
                  required={field.required}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              )}

              {field.type === "number" && (
                <Input
                  id={field.name}
                  type="number"
                  required={field.required}
                  value={(values[field.name] as number) ?? 0}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: Number(e.target.value) }))}
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.name}
                  value={(values[field.name] as string) ?? ""}
                  onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                />
              )}

              {field.type === "select" && (
                <Select
                  items={field.options}
                  value={(values[field.name] as string) ?? ""}
                  onValueChange={(value) => setValues((v) => ({ ...v, [field.name]: value ?? "" }))}
                >
                  <SelectTrigger id={field.name} className="w-full">
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center gap-2">
                  <Switch
                    id={field.name}
                    checked={(values[field.name] as boolean) ?? false}
                    onCheckedChange={(checked) => setValues((v) => ({ ...v, [field.name]: checked }))}
                  />
                  <Label htmlFor={field.name}>{field.label}</Label>
                </div>
              )}
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
