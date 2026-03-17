import type { Role } from "@/app/features/roles/data/role";
import BaseApiService from "../baseApiService";

export default class RolesApiService extends BaseApiService<Role>
{
  routeName: string = "Roles";
}
