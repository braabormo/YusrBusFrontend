import EntityState from "@/app/core/state/entityState";
import { createSlice } from "@reduxjs/toolkit";
import type Branch from "../data/branch";
import BranchesApiService from "@/app/core/networking/services/branchesApiService";

const branchState = new EntityState<Branch>(new BranchesApiService());

export const branchSlice = createSlice({
    name: "branch",
    initialState: branchState,
    reducers: {
        refresh: branchState.refresh
    }
});

export const { } = branchSlice.actions

export default branchSlice.reducer