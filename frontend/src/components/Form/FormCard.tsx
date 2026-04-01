type PropsFormCard = {
  children: React.ReactNode;
};

export const FormCard = ({ children }: PropsFormCard) => {
  return (
    <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-6 flex flex-col gap-6 transition-colors duration-200">
      {children}
    </div>
  );
};
