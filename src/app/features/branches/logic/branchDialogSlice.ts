import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import Branch from "../data/branch";

export const branchDialogSlice = createGenericDialogSlice<Branch>("branchDialog");

export const {
  openChangeDialog: openBranchChangeDialog,
  openDeleteDialog: openBranchDeleteDialog,
  setIsChangeDialogOpen: setIsBranchChangeDialogOpen,
  setIsDeleteDialogOpen: setIsBranchDeleteDialogOpen
} = branchDialogSlice.actions;

export default branchDialogSlice.reducer;
