import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";
import type { City } from "../../data/city";
import CitiesApiService from "../../networking/services/citiesApiService";

const citySlice = createGenericEntitySlice<City>("city", new CitiesApiService());

export const { setCurrentPage: setCurrentCitiesPage, refresh: refreshCities, filter: filterCities } = citySlice.actions;
export default citySlice.reducer;