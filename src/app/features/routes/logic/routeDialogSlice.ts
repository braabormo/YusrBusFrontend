import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import type { Route } from "../data/route";

export const routeDialogSlice = createGenericDialogSlice<Route>("routeDialog");

export const {
  openChangeDialog: openRouteChangeDialog,
  openDeleteDialog: openRouteDeleteDialog,
  setIsChangeDialogOpen: setIsRouteChangeDialogOpen,
  setIsDeleteDialogOpen: setIsRouteDeleteDialogOpen
} = routeDialogSlice.actions;

export default routeDialogSlice.reducer;
