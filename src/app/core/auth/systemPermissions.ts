export class SystemPermissions
{
    static Create(resource: string, action: string): string
    {
        return `${resource}:${action}`;
    }
}