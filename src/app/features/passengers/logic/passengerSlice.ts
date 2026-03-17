import PassengersApiService from "@/app/core/networking/services/passengersApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";

const { reducer, actions } = createGenericEntitySlice("passenger", new PassengersApiService());

export const { setCurrentPage: setCurrentPassengersPage, refresh: refreshPassengers, filter: filterPassengers } =
  actions;
export default reducer;
