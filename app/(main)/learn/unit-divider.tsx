import { FC, ReactNode } from 'react';

interface UnitDividerProps {
  children: ReactNode;
}

export const UnitDivider: FC<UnitDividerProps> = ({ children }) =&gt; (
  &lt;div className="my-12 flex items-center"&gt;
    &lt;div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"&gt;&lt;/div&gt;
    &lt;span className="px-8 py-3 text-lg font-semibold text-gray-500 bg-white shadow-sm rounded-full mx-[-12px] z-10 border border-gray-200"&gt;
      {children}
    &lt;/span&gt;
    &lt;div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"&gt;&lt;/div&gt;
  &lt;/div&gt;
);