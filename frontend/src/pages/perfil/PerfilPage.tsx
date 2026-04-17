import { Header } from "../../components/Dashboard/Header";
import { useAuth } from "../../context/AuthContext";
import { AvatarHeader } from "./AvatarHeader";
import { PerfilForm } from "./PerfilForm";

export default function PerfilPage() {
  const { user } = useAuth();

  return (
    <main className="flex-1 overflow-y-auto bg-[#F5F6FA] dark:bg-[#0F172A] p-6 sm:p-8">
      <Header />

      <div className="mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1E293B] dark:text-[#F1F5F9]">
            Meu Perfil
          </h1>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Gerencie suas informações e segurança
          </p>
        </div>

        {user && <AvatarHeader username={user.username} />}

        <PerfilForm />
      </div>
    </main>
  );
}
