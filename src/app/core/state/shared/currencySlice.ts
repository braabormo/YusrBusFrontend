import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";
import type { Currency } from "../../data/currency";
import CurrenciesApiService from "../../networking/services/currenciesApiService";

const citySlice = createGenericEntitySlice<Currency>("currency", new CurrenciesApiService());

export const { setCurrentPage: setCurrentCurrenciesPage, refresh: refreshCurrencies, filter: filterCurrencies } =
  citySlice.actions;
export default citySlice.reducer;
