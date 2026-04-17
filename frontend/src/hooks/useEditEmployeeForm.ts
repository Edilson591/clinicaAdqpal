import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useZodForm } from "./useZodForm";
import {
  editEmployeeSchema,
  type EditEmployeeInput,
} from "../validate/editEmployee.schema";
import { employeeService } from "../services/Employee";
import { userService } from "../services/User";
import { USER_KEYS, useUsers } from "./useUsers";
import { formatCpf } from "../utils/formatCpf";
import { formatPhone } from "../utils/formatPhone";
import { formatCep } from "../utils/formatCep";

const EMPLOYEE_KEYS = { all: ["employees"] as const };

export function useEditEmployeeForm(employeeId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Evita resetar o form múltiplas vezes após o primeiro carregamento
  const hasReset = useRef(false);

  const {
    data: employee,
    isLoading: isLoadingEmployee,
    error: loadError,
  } = useQuery({
    queryKey: ["employees", employeeId],
    queryFn: () => employeeService.getById(employeeId),
    enabled: !!employeeId,
  });

  // Busca todos os usuários para encontrar o vinculado pelo e-mail
  const { data: allUsers = [], isLoading: isLoadingUsers } = useUsers();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
    reset,
  } = useZodForm(editEmployeeSchema, {
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      phone: "",
      position: "",
      department: "",
      status: "ACTIVE",
      hireDate: "",
      salary: "",
      dateOfBirth: "",
      gender: "",
      street: "",
      streetNumber: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
      hasSystemAccess: false,
      username: "",
      roleId: "",
      password: "",
      confirmPassword: "",
    },
  });

  const hasSystemAccess = watch("hasSystemAccess");

  // Preenche o form quando os dados chegam
  useEffect(() => {
    if (!employee || isLoadingUsers || hasReset.current) return;

    // Procura usuário com mesmo e-mail do funcionário
    const linkedUser = employee.email
      ? allUsers.find((u) => u.email === employee.email)
      : undefined;

    reset({
      name: employee.name,
      email: employee.email ?? "",
      cpf: formatCpf(employee.cpf ?? ""),
      phone: formatPhone(employee.phone ?? ""),
      position: employee.position,
      department: employee.department ?? "",
      status: employee.status,
      hireDate: employee.hireDate ? employee.hireDate.slice(0, 10) : "",
      salary: employee.salary != null ? String(employee.salary) : "",
      dateOfBirth: employee.dateOfBirth
        ? employee.dateOfBirth.slice(0, 10)
        : "",
      gender: employee.gender ?? "",
      street: employee.street ?? "",
      streetNumber: employee.streetNumber ?? "",
      city: employee.city ?? "",
      state: employee.state ?? "",
      zipCode: formatCep(employee.zipCode ?? ""),
      notes: employee.notes ?? "",
      hasSystemAccess: !!linkedUser,
      username: linkedUser?.username ?? "",
      roleId: linkedUser ? String(linkedUser.roleId) : "",
      password: "",
      confirmPassword: "",
    });

    hasReset.current = true;
  }, [employee, allUsers, isLoadingUsers, reset]);

  const mutation = useMutation({
    mutationFn: async (data: EditEmployeeInput) => {
      // 1. Sempre atualiza o funcionário
      const prevData = {
        ...data,
        cpf: data?.cpf?.replace(/\D/g, ""),
        phone: data.phone?.replace(/\D/g, ""),
        gender: data.gender || "feminino",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : null,
      };

      await employeeService.update(employeeId, {
        name: prevData.name,
        email: prevData.email || null,
        cpf: prevData.cpf || null,
        phone: prevData.phone || null,
        position: prevData.position,
        department: prevData.department || null,
        hireDate: prevData.hireDate || null,
        salary: prevData.salary ? Number(prevData.salary) : null,
        dateOfBirth: prevData.dateOfBirth || null,
        gender: prevData.gender || null,
        street: prevData.street || null,
        streetNumber: prevData.streetNumber || null,
        status: prevData.status || "ACTIVE",
        city: prevData.city || null,
        state: prevData.state || null,
        zipCode: prevData.zipCode || null,
        notes: prevData.notes || null,
      });

      // 2. Trata acesso ao sistema
      if (prevData.hasSystemAccess) {
        const linkedUser = prevData.email
          ? allUsers.find((u) => u.email === prevData.email)
          : undefined;

        if (linkedUser) {
          // Usuário já existe → atualiza username e roleId (e senha se preenchida)
          await userService.update(linkedUser.id, {
            username: prevData.username,
            roleId: Number(prevData.roleId),
            ...(prevData.password ? { password: prevData.password } : {}),
          });
          queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
        } else {
          // Usuário não existe → cria novo
          const cpfDigits = (prevData.cpf ?? "").replace(/\D/g, "");
          await userService.register({
            username: prevData.username!,
            email: prevData.email || prevData.username!,
            password: prevData.password!,
            roleId: Number(prevData.roleId),
            cpf: cpfDigits.length === 11 ? cpfDigits : null,
            cnpj: null,
          });
          queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      navigate("/rh");
    },
  });

  return {
    register,
    setValue,
    watch,
    errors,
    hasSystemAccess,
    control,
    isLoading: isLoadingEmployee || isLoadingUsers,
    isSaving: mutation.isPending,
    saveError: mutation.error
      ? ((mutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao salvar.")
      : null,
    loadError: loadError ? "Funcionário não encontrado." : null,
    onSubmit: handleSubmit((data) => mutation.mutate(data)),
    // Indica se o funcionário já tem usuário (para feedback visual)
    hasLinkedUser: employee?.email
      ? allUsers.some((u) => u.email === employee.email)
      : false,
  };
}

// Mantém a exportação do schema antigo por compatibilidade (caso usado em outro lugar)
export { editEmployeeSchema as employeeSchema };
export type { EditEmployeeInput as EmployeeFormInput };
