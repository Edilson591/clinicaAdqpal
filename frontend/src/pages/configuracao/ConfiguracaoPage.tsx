// import { Check } from "lucide-react";
// import { useState } from "react";
// import { ConfigHeader } from "../../components/Config/ConfigHeader";
// // import { PerfilSection } from "../../components/Config/PerfilSection";
// import { SegurancaSection } from "../../components/Config/SegurancaSection";
// import { PreferenciasSection } from "../../components/Config/PreferenciasSection";
// import { NotificacoesSection } from "../../components/Config/NotificacoesSection";
// import type { PerfilInput } from "../../validate/perfil.schema";
// // import { useZodForm } from "../../hooks/useZodForm";


// function Divider() {
//   return <div className="h-px bg-[#E2E8F0] dark:bg-[#334155]" />;
// }

// function ConfigContent() {
//   // Notificações
//   const [lembretes, setLembretes] = useState(true);
//   const [pacientes, setPacientes] = useState(true);
//   const [sistema, setSistema] = useState(false);

//   // Feedback global de salvamento
//   const [saved, setSaved] = useState(false);

//   // const {
//   //   register,
//   //   handleSubmit,
//   //   watch,
//   //   formState: { errors },
//   // } = useZodForm(perfilSchema, {
//   //   defaultValues: {
//   //     nome: "Dr. Silva",
//   //     email: "dr.silva@adqpal.com",
//   //   },
//   // });

//   // Watch para o avatar preview
//   // const nome = watch("nome") ?? "";
//   // const especialidade = watch("specialtyIds") ?? "";

//   function onSubmit(_data: PerfilInput) {
//     // TODO: replace with useMutation(userService.updateProfile) when API is ready
//     setSaved(true);
//     console.log(_data)
//     setTimeout(() => setSaved(false), 2500);
//   }

//   return (
//     // pen: d3fY6 · bg #F8FAFC light · #0F172A dark · padding 32 · gap 24
//     <main className="flex-1 bg-[#F8FAFC] dark:bg-[#0F172A] overflow-y-auto transition-colors duration-200">
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div className="p-4 sm:p-6 lg:p-8 flex flex-col">
//           {/* Header — pen: fnUSB */}
//           <ConfigHeader />

//           {/* Config card — pen: yzhBC · bg #FFFFFF · border #E2E8F0 · cornerRadius 12 · padding 24 */}
//           <div className="bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl p-6 flex flex-col gap-6 transition-colors duration-200">
//             {/* pen: egyhV — Perfil do Usuário */}
//             {/* <PerfilSection
//               register={register}
//               errors={errors}
//               nome={nome}
//               especialidade={especialidade}
//             /> */}

//             <Divider />

//             {/* Segurança */}
//             <SegurancaSection />

//             <Divider />

//             {/* Preferências / Tema */}
//             <PreferenciasSection />

//             <Divider />

//             {/* pen: AE2zu — Notificações */}
//             <NotificacoesSection
//               lembretes={lembretes}
//               pacientes={pacientes}
//               sistema={sistema}
//               onLembretesChange={setLembretes}
//               onPacientesChange={setPacientes}
//               onSistemaChange={setSistema}
//             />

//             {/* pen: 28eBU — Botão Salvar · bg #38a169, h:44, w:160 */}
//             <div className="flex items-center gap-4 pt-2">
//               <button
//                 type="submit"
//                 className="h-11 px-6 bg-[#38A169] hover:bg-[#2F9259] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
//               >
//                 Salvar Alterações
//               </button>

//               {saved && (
//                 <span className="flex items-center gap-1.5 text-sm font-medium text-[#38A169] animate-in fade-in">
//                   <Check size={15} />
//                   Alterações salvas com sucesso!
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </form>
//     </main>
//   );
// }

// export default function ConfiguracaoPage() {
//   return <ConfigContent />;
// }
