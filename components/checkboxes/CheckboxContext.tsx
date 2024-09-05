import React, { createContext, useContext, useState } from 'react';

interface CheckBoxContextType {
  selectedRunners: number[][];
  setSelectedRunners: React.Dispatch<React.SetStateAction<number[][]>>;
}

const CheckBoxContext = createContext<CheckBoxContextType | undefined>(undefined);

export const CheckBoxProvider: React.FC<{ children: React.ReactNode, numOfCourses: number }> = ({ children, numOfCourses }) => {
  const [selectedRunners, setSelectedRunners] = useState<number[][]>(
    Array.from({ length: 3 }, () => 
    Array.from({ length: 5 }, (_, index) => index)));

  return (
    <CheckBoxContext.Provider value={{ selectedRunners, setSelectedRunners }}>
      {children}
    </CheckBoxContext.Provider>
  );
};

export const useCheckBoxContext = (): CheckBoxContextType => {
  const context = useContext(CheckBoxContext);
  if (!context) {
    throw new Error('useCheckBoxContext must be used within a CheckBoxProvider');
  }
  return context;
};
