import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";
import type Branch from "../data/branch";

const branchSlice = createGenericEntitySlice<Branch>("branch", new BranchesApiService());

export const { setCurrentPage, refresh, filter } = branchSlice.actions;
export default branchSlice.reducer;