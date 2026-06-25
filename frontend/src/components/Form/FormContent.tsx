type PropsFormContent = {
  children: React.ReactNode;
};

export const FormContent = ({ children }: PropsFormContent) => {
  return (
    <main className="flex-1 min-w-0 relative dark:bg-[#0F172A] overflow-y-auto">
      <div className="absolute inset-0 bg-[url('/bg-fundo.jpeg')] bg-no-repeat bg-cover bg-center opacity-10 z-[-1] dark:bg-none" />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6">{children}</div>
    </main>
  );
};
