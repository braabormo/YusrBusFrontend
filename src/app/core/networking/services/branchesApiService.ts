import type Branch from "@/app/features/branches/data/branch";
import BaseApiService from "../baseApiService";

export default class BranchesApiService extends BaseApiService<Branch>
{
  routeName: string = "Branches";
}
