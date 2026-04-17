interface AvatarHeaderProps {
  username: string;
}

export function AvatarHeader({ username }: AvatarHeaderProps) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-[#1E293B] rounded-xl border border-[#E5E7EB] dark:border-[#334155] p-6">
      <div className="w-16 h-16 rounded-full bg-[#38A169] flex items-center justify-center shrink-0">
        <span className="text-white text-2xl font-bold uppercase">
          {username.charAt(0)}
        </span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
          {username}
        </h2>
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
          Membro da equipe ADQPAL
        </p>
      </div>
    </div>
  );
}
