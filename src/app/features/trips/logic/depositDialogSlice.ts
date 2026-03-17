import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import type { Deposit } from "../data/deposit";

export const DepositDialogSlice = createGenericDialogSlice<Deposit>("depositDialog");

export const {
  openChangeDialog: openDepositChangeDialog,
  openDeleteDialog: openDepositDeleteDialog,
  setIsChangeDialogOpen: setIsDepositChangeDialogOpen,
  setIsDeleteDialogOpen: setIsDepositDeleteDialogOpen
} = DepositDialogSlice.actions;

export default DepositDialogSlice.reducer;
