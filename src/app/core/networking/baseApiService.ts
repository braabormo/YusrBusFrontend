import type { FilterCondition } from "../data/filterCondition";
import type { FilterResult } from "../data/filterResult";
import type { RequestResult } from "../data/requestResult";
import ApiConstants from "./apiConstants";
import YusrApiHelper from "./yusrApiHelper";

 export default abstract class BaseApiService<T>
 {
    abstract routeName : string; 

    async Filter(pageNumber: number, rowsPerPage: number, condition?: FilterCondition): Promise<RequestResult<FilterResult<T>>> 
    {        
        return await YusrApiHelper.Post(`${ApiConstants.baseUrl}/${this.routeName}/Filter?pageNumber=${pageNumber}&rowsPerPage=${rowsPerPage}`, condition);
    }

    async Get(id: number): Promise<RequestResult<T>>
    {
        return await YusrApiHelper.Get(`${ApiConstants.baseUrl}/${this.routeName}/${id}`);
    }

    async Add(entity: T)
    {
        return await YusrApiHelper.Post(`${ApiConstants.baseUrl}/${this.routeName}/Add`, entity, undefined, 'تم حفظ البيانات بنجاح');
    }

    async Update(entity: T)
    {
        return await YusrApiHelper.Put(`${ApiConstants.baseUrl}/${this.routeName}/Update`, entity, undefined, 'تم تحديث المعلومات بنجاح');
    }

    async Delete(id: number)
    {
        return await YusrApiHelper.Delete(`${ApiConstants.baseUrl}/${this.routeName}/${id}`, undefined, 'تمت إزالة السجل بنجاح');
    }
 }