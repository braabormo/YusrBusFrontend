import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import Branch from "../data/branch";

export const branchDialogSlice = createGenericDialogSlice<Branch>("branchDialog");

export const {
  openEditDialog: openBranchEditDialog,
  openDeleteDialog: openBranchDeleteDialog,
  setIsEditDialogOpen: setIsBranchEditDialogOpen,
  setIsDeleteDialogOpen: setIsBranchDeleteDialogOpen,
} = branchDialogSlice.actions;

export default branchDialogSlice.reducer;
