import BranchesApiService from "@/app/core/networking/services/branchesApiService";
import { EntityActions } from "@/app/core/state/entityActions";
import type IEntityState from "@/app/core/state/iEntityState";
import { createSlice } from "@reduxjs/toolkit";
import Branch from "../data/branch";

const initialState: IEntityState<Branch> = {
  entities: {
    data:[],
    count: 0,
  },
  isLoading: false,
  currentPage: 1,
  rowsPerPage: 100,
};

const sliceName = "branch";

const actions = new EntityActions<Branch>(sliceName, new BranchesApiService());

export const branchSlice = createSlice({
  name: sliceName,
  initialState: initialState,
  reducers: {
    setCurrentPage: actions.setCurrentPage,
    refresh: actions.refresh,
  },
  extraReducers: (builder) => {
    builder
      .addCase(actions.filter.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(actions.filter.fulfilled, (state, action) => {
        state.isLoading = false;
        if(action.payload) {
            state.entities = action.payload;
        }
      })
      .addCase(actions.filter.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setCurrentPage, refresh } = branchSlice.actions;
export const filter = actions.filter;

export default branchSlice.reducer;