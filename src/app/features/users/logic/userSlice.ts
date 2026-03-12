import UsersApiService from "@/app/core/networking/services/usersApiService";
import { createGenericEntitySlice } from "@/app/core/state/generics/genericEntitySlice";

const { reducer, actions } = createGenericEntitySlice("user", new UsersApiService());

export const { setCurrentPage: setCurrentUsersPage, refresh: refreshUsers, filter: filterUsers } = actions;
export default reducer;
