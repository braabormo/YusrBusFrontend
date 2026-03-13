import TripsApiService from "@/app/core/networking/services/tripsApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";

const { reducer, actions } = createGenericEntitySlice(
  "trip",
  new TripsApiService(),
);

export const {
  setCurrentPage: setCurrentTripsPage,
  refresh: refreshTrips,
  filter: filterTrips,
} = actions;
export default reducer;
