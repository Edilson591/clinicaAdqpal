import type { ReactNode } from "react";

interface DefaultMainSectionProps {
  children: ReactNode;
}

export const DefaultMainSection = ({ children }: DefaultMainSectionProps) => {
  return (
    <main className="flex-1 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />

      {children}
    </main>
  );
};
