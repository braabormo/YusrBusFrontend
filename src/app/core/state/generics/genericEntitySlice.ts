import {
    createAsyncThunk,
    createSlice,
    type PayloadAction
} from "@reduxjs/toolkit";
import { castDraft } from "immer";
import type { BaseEntity } from "../../data/baseEntity";
import type { FilterCondition } from "../../data/filterCondition";
import type { FilterResult } from "../../data/filterResult";
import type { RequestResult } from "../../data/requestResult";
import type BaseFilterableApiService from "../../networking/baseFilterableApiService";
import type IEntityState from "../interfaces/iEntityState";

type FilterMethodType<T> = (
  pageNumber: number,
  rowsPerPage: number,
  condition?: FilterCondition | undefined,
) => Promise<RequestResult<FilterResult<T>>> | undefined;

export function createGenericEntitySlice<T extends BaseEntity>(sliceName: string, service: BaseFilterableApiService<T>, filterMethod?: FilterMethodType<T>) 
{
    const initialState: IEntityState<T> = {
        entities: { data: [], count: 0 },
        isLoading: false,
        currentPage: 1,
        rowsPerPage: 100,
    };

    const slice = createSlice({
        name: sliceName,
        initialState,
        reducers: {
            setCurrentPage: (state, action: PayloadAction<number>) => {
                state.currentPage = action.payload;
            },
            refresh: (state, action: PayloadAction<{ newData?: T; deletedId?: number }>) => {
                const { newData, deletedId } = action.payload;
                if (deletedId) {
                    state.entities.count -= 1;
                    state.entities.data = state.entities.data?.filter((b) => b.id !== deletedId);
                } 
                else if (newData) {
                    const index = state.entities.data?.findIndex((b) => b.id === newData.id);
                    if (index !== undefined && index !== -1) {
                        if (state.entities.data)
                            state.entities.data[index] = castDraft(newData);
                    } 
                    else {
                        state.entities.count += 1;
                        state.entities.data = [castDraft(newData), ...(state.entities.data ?? [])];
                    }
                }
            },
        },
        extraReducers: (builder) => {
            builder
                .addCase(filter.pending, (state) => { state.isLoading = true; })
                .addCase(filter.fulfilled, (state, action) => {
                    state.isLoading = false;
                    if (action.payload) 
                        state.entities = action.payload as any;
                })
                .addCase(filter.rejected, (state) => { state.isLoading = false; });
        },
    });

    const filter = createAsyncThunk(
        `${sliceName}/filter`,
        async (condition: FilterCondition | undefined, { getState }) => {
        const state = (getState() as any)[sliceName] as IEntityState<T>;

        let result;
        if (filterMethod) {
            result = await filterMethod(
            state.currentPage,
            state.rowsPerPage,
            condition
            );
        } 
        else {
            result = await service.Filter(
            state.currentPage,
            state.rowsPerPage,
            condition
            );
        }

        return result?.data;
        }
    );

  return {
    reducer: slice.reducer,
    actions: { ...slice.actions, filter },
  };
}