export interface IDialogState<T> {
  selectedRow: T | null;
  isEditDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
}