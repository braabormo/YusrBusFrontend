import type { AppDispatch } from "../state/store";
import { AuthConstants } from "./authConstants";
import { logout, syncFromStorage } from "./authSlice";

export const setupAuthListeners = (dispatch: AppDispatch) =>
{
  window.addEventListener("storage", (e) =>
  {
    if (e.key === AuthConstants.AuthCheckStorageItemName)
    {
      dispatch(syncFromStorage());
    }
  });

  window.addEventListener(AuthConstants.UnauthorizedEventName, () =>
  {
    dispatch(logout());
  });
};
