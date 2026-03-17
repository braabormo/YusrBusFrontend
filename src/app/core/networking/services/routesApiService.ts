import type { Route } from "@/app/features/routes/data/route";
import BaseApiService from "../baseApiService";

export default class RoutesApiService extends BaseApiService<Route>
{
  routeName: string = "Routes";
}
