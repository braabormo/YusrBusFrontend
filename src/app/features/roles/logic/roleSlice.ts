import RolesApiService from "@/app/core/networking/services/rolesApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";

const { reducer, actions } = createGenericEntitySlice("role", new RolesApiService());

export const { setCurrentPage: setCurrentRolesPage, refresh: refreshRoles, filter: filterRoles } = actions;
export default reducer;