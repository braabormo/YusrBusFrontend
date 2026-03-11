import type { PayloadAction } from "@reduxjs/toolkit";
import type { BaseEntity } from "../data/baseEntity";
import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type BaseApiService from "../networking/baseApiService";
import type { RequestResult } from "../data/requestResult";

type FilterMethodType<T> = (
  pageNumber: number, 
  rowsPerPage: number, 
  condition?: FilterCondition | undefined
) => Promise<RequestResult<FilterResult<T>>> | undefined;

export default class EntityState<T extends BaseEntity>
{
    public entities : FilterResult<T> = {
        data: [],
        count: 0
    };
    public isLoading : boolean = false;
    public currentPage : number = 1;
    public rowsPerPage : number = 100;
    private _service! : BaseApiService<T>;
    private _filterMethod? : FilterMethodType<T> = undefined;

    constructor(service: BaseApiService<T>, filterMethod?: FilterMethodType<T>){
        this._service = service;
        this._filterMethod = filterMethod;
    }

    filter = async (state: EntityState<T>, action: PayloadAction<FilterResult<T>>, condition?: FilterCondition) => {
        state.isLoading = true;

        let result;
        if(this._filterMethod)
            result = await this._filterMethod(this.currentPage, this.rowsPerPage, condition);
        else
            result = await this._service.Filter(this.currentPage, this.rowsPerPage, condition);

        state.isLoading = false;
        if (result?.data) 
            action.payload = result.data;
    };

    refresh = (state: EntityState<T>, action: PayloadAction<{ newData?: T, deletedId?: number }>) => {
        const { newData, deletedId } = action.payload;

        if (deletedId) {
            state.entities.count -= 1;
            state.entities.data = state.entities.data?.filter((b) => b.id !== deletedId);
        } 
        else if (newData) {
            const index = state.entities.data?.findIndex(b => b.id === newData.id);
            
            if (index !== undefined && index !== -1) {
                if (state.entities.data) 
                    state.entities.data[index] = newData;
            } 
            else {
                state.entities.count += 1;
                state.entities.data = [newData, ...(state.entities.data ?? [])];
            }
        }
    };
}