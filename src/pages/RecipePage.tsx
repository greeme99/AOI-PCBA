import React from 'react';
import { RecipeEditor } from '../components/RecipeManager/RecipeEditor';
import { useInspectionStore } from '../stores/useInspectionStore';
import { useUIStore } from '../stores/useUIStore';

export default function RecipePage() {
  const currentRecipe = useInspectionStore((s) => s.getCurrentRecipe());
  const saveRecipe = useInspectionStore((s) => s.saveRecipe);
  const ipcClass = useInspectionStore((s) => s.ipcClass);
  const setIpcClass = useInspectionStore((s) => s.setIpcClass);
  const themeMode = useUIStore((s) => s.themeMode);

  return (
    <RecipeEditor
      recipe={currentRecipe}
      onSaveRecipe={saveRecipe}
      ipcClass={ipcClass}
      onChangeIPCClass={setIpcClass}
      themeMode={themeMode}
    />
  );
}
