import branchDialogReducer from "@/app/features/branches/logic/branchDialogSlice";
import branchReducer from "@/app/features/branches/logic/branchSlice";
import routeDialogReducer from "@/app/features/routes/logic/routeDialogSlice";
import routeReducer from "@/app/features/routes/logic/routeSlice";
import userDialogReducer from "@/app/features/users/logic/userDialogSlice";
import userReducer from "@/app/features/users/logic/userSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupAuthListeners } from "../auth/authListener";
import authReducer from "../auth/authSlice";
import cityReducer from "./shared/citySlice";
import countryReducer from "./shared/countrySlice";
import currencyReducer from "./shared/currencySlice";
import passebgerReducer from "@/app/features/passengers/logic/passengerSlice";
import passengerDialogReducer from "@/app/features/passengers/logic/passengerDialogSlice";

export const store = configureStore({
  reducer: {
    branch: branchReducer,
    branchDialog: branchDialogReducer,
    route: routeReducer,
    routeDialog: routeDialogReducer,
    user: userReducer,
    userDialog: userDialogReducer,
    passenger: passebgerReducer,
    passengerDialog: passengerDialogReducer,
    city: cityReducer,
    country: countryReducer,
    currency: currencyReducer,
    auth: authReducer,
  },
});

setupAuthListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
