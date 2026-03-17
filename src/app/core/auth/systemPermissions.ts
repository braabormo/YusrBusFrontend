export class SystemPermissions
{
  static Format(resource: string, action: string): string
  {
    return `${resource}:${action}`;
  }
  static hasAuth(permissions: string[], resource: string, action: string)
  {
    const formattedPermissions = this.Format(resource, action);
    return permissions.includes(formattedPermissions);
  }
  private permissions: string[];
  private resource: string;
  constructor(permissions: string[], resource: string)
  {
    this.permissions = permissions;
    this.resource = resource;
  }
  public hasAuth(action: string): boolean
  {
    return SystemPermissions.hasAuth(this.permissions, this.resource, action);
  }
  public static getFirstPermissionPath(permissions: string[]): string
  {
    if (!permissions?.length)
    {
      return "";
    }

    const [resource] = permissions[0].split(":");
    return `/${resource.toLowerCase()}`;
  }
}
