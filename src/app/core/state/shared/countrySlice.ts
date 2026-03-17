import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";
import type { Country } from "../../data/country";
import CountriesApiService from "../../networking/services/countriesApiService";

const citySlice = createGenericEntitySlice<Country>("country", new CountriesApiService());

export const { setCurrentPage: setCurrentCountriesPage, refresh: refreshCountries, filter: filterCountries } =
  citySlice.actions;
export default citySlice.reducer;
