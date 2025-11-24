import { useState } from 'react';

export const useProfileInfoTab = () => {
  const [isEditing, setIsEditing] = useState(false);

  const startEditing = () => setIsEditing(true);
  const stopEditing = () => setIsEditing(false);

  return {
    isEditing,
    startEditing,
    stopEditing,
  };
};





