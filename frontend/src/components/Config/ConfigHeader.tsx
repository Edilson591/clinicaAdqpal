import { Settings } from "lucide-react";

import { Header } from "../Dashboard/Header";

export function ConfigHeader() {
  return (
    <>
      <Header isSearchAvaliable={false} />
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings size={20} className="text-[#38A169]" />
          <h1 className="text-2xl font-semibold text-[#1E293B] dark:text-[#F1F5F9]">
            Configurações
          </h1>
        </div>
      </div>
    </>
  );
}
