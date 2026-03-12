import { createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { BaseEntity } from "../data/baseEntity";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";
import type BaseApiService from "../networking/baseApiService";
import type IEntityState from "./iEntityState";

type FilterMethodType<T> = (
  pageNumber: number,
  rowsPerPage: number,
  condition?: FilterCondition | undefined,
) => Promise<RequestResult<FilterResult<T>>> | undefined;

export class EntityActions<T extends BaseEntity> {
    private _service!: BaseApiService<T>;
    private _filterMethod?: FilterMethodType<T> = undefined;
    private _sliceName!: string;

    constructor(sliceName: string, service: BaseApiService<T>, filterMethod?: FilterMethodType<T>) {
        this._service = service;
        this._filterMethod = filterMethod;
        this._sliceName = sliceName;
    }

    filter = createAsyncThunk(
        `${this._sliceName}/filter`,
        async (condition: FilterCondition | undefined, { getState }) => {
            const state = (getState() as any)[this._sliceName] as IEntityState<T>;

            let result;
            if (this._filterMethod){
                result = await this._filterMethod(
                    state.currentPage,
                    state.rowsPerPage,
                    condition,
                );
            } 
            else {
                result = await this._service.Filter(
                    state.currentPage,
                    state.rowsPerPage,
                    condition,
                );
            }

            return result?.data;
        }
    );

    refresh = (
        state: IEntityState<T>,
        action: PayloadAction<{ newData?: T; deletedId?: number }>,
    ) => {
        const { newData, deletedId } = action.payload;

        if (deletedId) {
            state.entities.count -= 1;
            state.entities.data = state.entities.data?.filter((b) => b.id !== deletedId);
        } 
        else if (newData) {
            const index = state.entities.data?.findIndex((b) => b.id === newData.id);

            if (index !== undefined && index !== -1) {
                if (state.entities.data) state.entities.data[index] = newData;
            } 
            else {
                state.entities.count += 1;
                state.entities.data = [newData, ...(state.entities.data ?? [])];
            }
        }
    };

    setCurrentPage = (state: IEntityState<T>, action: PayloadAction<number>) => {
        state.currentPage = action.payload;
    }
}