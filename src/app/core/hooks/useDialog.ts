import { useState } from "react";

export default function useDialog<T>() {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const openEditDialog = (entity: T) => {
    setSelectedRow(entity);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (entity: T) => {
    setSelectedRow(entity);
    setIsDeleteDialogOpen(true);
  };

  return {
    selectedRow,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    openEditDialog,
    openDeleteDialog,
  };
}
