import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import type { Role } from "../data/role";

export const roleDialogSlice = createGenericDialogSlice<Role>("roleDialog");

export const {
  openChangeDialog: openRoleChangeDialog,
  openDeleteDialog: openRoleDeleteDialog,
  setIsChangeDialogOpen: setIsRoleChangeDialogOpen,
  setIsDeleteDialogOpen: setIsRoleDeleteDialogOpen,
} = roleDialogSlice.actions;

export default roleDialogSlice.reducer;