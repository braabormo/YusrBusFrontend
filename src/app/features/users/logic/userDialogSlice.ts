import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import type User from "../data/user";

export const userDialogSlice = createGenericDialogSlice<User>("userDialog");

export const {
  openEditDialog: openUserEditDialog,
  openDeleteDialog: openUserDeleteDialog,
  setIsEditDialogOpen: setIsUserEditDialogOpen,
  setIsDeleteDialogOpen: setIsUserDeleteDialogOpen,
} = userDialogSlice.actions;

export default userDialogSlice.reducer;