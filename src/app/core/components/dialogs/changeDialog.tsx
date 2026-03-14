import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

import type { PropsWithChildren } from "react";
import type { BaseEntity } from "../../data/baseEntity";
import SaveButton, { type SaveButtonProps } from "../buttons/saveButton";

export interface ChangeDialogProps<T extends BaseEntity> extends SaveButtonProps<T>, PropsWithChildren {
  title: string;
  description?: string;
}

export default function ChangeDialog<T extends BaseEntity>({
  title,
  description = "",
  formData,
  dialogMode,
  service,
  disable,
  onSuccess,
  validate = () => true,
  children,
}: ChangeDialogProps<T>) {
  return (
    <DialogContent dir="rtl" className="sm:max-w-[80%] scroll-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <Separator />

      {children}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">إلغاء</Button>
        </DialogClose>
        <SaveButton
          formData={formData as T}
          dialogMode={dialogMode}
          service={service}
          disable={disable}
          onSuccess={onSuccess}
          validate={validate}
        />
      </DialogFooter>
    </DialogContent>
  );
}
