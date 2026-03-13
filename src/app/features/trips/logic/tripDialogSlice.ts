import { createGenericDialogSlice } from "@/app/core/state/generics/genericDialogSlice";
import type { Trip } from "../data/trip";

export const TripDialogSlice = createGenericDialogSlice<Trip>("tripDialog");

export const {
  openChangeDialog: openTripChangeDialog,
  openDeleteDialog: openTripDeleteDialog,
  setIsChangeDialogOpen: setIsTripChangeDialogOpen,
  setIsDeleteDialogOpen: setIsTripDeleteDialogOpen,
} = TripDialogSlice.actions;

export default TripDialogSlice.reducer;
