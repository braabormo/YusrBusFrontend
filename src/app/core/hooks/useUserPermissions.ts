import { SystemPermissions } from "../auth/systemPermissions";
import { SystemPermissionsActions } from "../auth/systemPermissionsActions";
import { useLoggedInUser } from "../contexts/loggedInUserContext";

export default function useUserPermissions(resource: string) {
  const { loggedInUser } = useLoggedInUser();
  const permissions: string[] = loggedInUser?.role?.permissions || [];
  const systemPermissions = new SystemPermissions(permissions, resource);
  const getPermission = systemPermissions.hasAuth(SystemPermissionsActions.Get);
  const addPermission = systemPermissions.hasAuth(SystemPermissionsActions.Add);
  const updatePermission = systemPermissions.hasAuth(
    SystemPermissionsActions.Update,
  );
  const deletePermission = systemPermissions.hasAuth(
    SystemPermissionsActions.Delete,
  );

  return { getPermission, addPermission, updatePermission, deletePermission };
}
