import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IDialogState } from "../interfaces/iDialogState";

export function createGenericDialogSlice<T>(sliceName: string) {
  const initialState: IDialogState<T> = {
    selectedRow: null,
    isEditDialogOpen: false,
    isDeleteDialogOpen: false,
  };

  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      openEditDialog: (state, action: PayloadAction<T>) => {
        state.selectedRow = action.payload as any; 
        state.isEditDialogOpen = true;
      },
      openDeleteDialog: (state, action: PayloadAction<T>) => {
        state.selectedRow = action.payload as any; 
        state.isDeleteDialogOpen = true;
      },
      setIsEditDialogOpen: (state, action: PayloadAction<boolean>) => {
        state.isEditDialogOpen = action.payload;
        if (!action.payload) state.selectedRow = null as any;
      },
      setIsDeleteDialogOpen: (state, action: PayloadAction<boolean>) => {
        state.isDeleteDialogOpen = action.payload;
        if (!action.payload) state.selectedRow = null as any;
      },
    },
  });
}