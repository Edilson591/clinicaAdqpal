type PropsFormContent = {
  children: React.ReactNode;
};

export const FormContent = ({ children }: PropsFormContent) => {
  return (
    <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6">{children}</div>
    </main>
  );
};
