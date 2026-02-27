import { FC, ReactNode } from 'react';

interface UnitDividerProps {
  children: ReactNode;
}

export const UnitDivider: FC<UnitDividerProps> = ({ children }) => (
  <div className="my-12 flex items-center">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    <span className="px-8 py-3 text-lg font-semibold text-gray-500 bg-white shadow-sm rounded-full mx-[-12px] z-10 border border-gray-200">
      {children}
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
  </div>
);