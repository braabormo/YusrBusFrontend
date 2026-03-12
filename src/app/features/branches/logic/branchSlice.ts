import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";

const { reducer, actions } = createGenericEntitySlice("branch", new BranchesApiService());

export const { setCurrentPage: setCurrentBranchesPage, refresh: refreshBranches, filter: filterBranches } = actions;
export default reducer;
