// import { Setting } from "@/app/core/data/setting";
// import { createContext, useContext, useState, type ReactNode } from "react";
// import { ContextConstants } from "./contextConstants";

// type SettingContextType = {
//   setting: Partial<Setting> | undefined;
//   updateSetting: (data: Partial<Setting>) => void;
//   clearSetting: () => void;
// };

// const SettingContext = createContext<SettingContextType | undefined>(undefined);

// export function SettingProvider({ children }: { children: ReactNode }) {

//   const [setting, setSetting] = useState<Partial<Setting> | undefined>(() => {
//     const savedSetting = localStorage.getItem(ContextConstants.SettingStorageItemName);
//     return savedSetting ? JSON.parse(savedSetting) : undefined;
//   });

//   const updateSetting = (data: Partial<Setting>) => {
//     setSetting((prev) => {
//       const newSetting = { ...prev, ...data };
//       localStorage.setItem(ContextConstants.SettingStorageItemName, JSON.stringify(newSetting));
//       return newSetting;
//     });
//   };

//   const clearSetting = () => {
//     localStorage.removeItem(ContextConstants.SettingStorageItemName);
//     setSetting(undefined);
//   };

//   return (
//     <SettingContext.Provider value={{ setting, updateSetting, clearSetting }}>
//       {children}
//     </SettingContext.Provider>
//   );
// }

// export const useSetting = () => {
//   const context = useContext(SettingContext);
//   if (!context) throw new Error("useSetting must be used within a SettingProvider");
//   return context;
// };