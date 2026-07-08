import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useZodForm } from "./useZodForm";
import {
  editUserSchema,
  type EditUserInput,
} from "../validate/editUser.schema";
import { userService } from "../services/User";
import { employeeService } from "../services/Employee";
import { formatCpf, formatCpfOrCpnj } from "../utils/formatCpf";
import { USER_KEYS } from "./useUsers";
import { USER_ROLES } from "../types/roles";
import { z } from "zod";

// import { specialtyService } from "../services/Specialty";
import { useSpecialties, useSpecialtiesByDoctor } from "./useSpecialties";

const EMPLOYEE_KEYS = {
  all: ["employees"] as const,
};

export function useEditUserForm(userId: string) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    error: loadError,
  } = useQuery({
    queryKey: USER_KEYS.detail(userId),
    queryFn: () => userService.getById(userId),
    enabled: !!userId,
  });

  // Busca todos os funcionários para encontrar o vinculado por e-mail
  const { data: allEmployees = [] } = useQuery({
    queryKey: EMPLOYEE_KEYS.all,
    queryFn: employeeService.getAll,
    enabled: !!user,
  });

  const { data: specialtiesData = [] } = useSpecialtiesByDoctor(user?.id ?? "");
  const { data: allSpecialties = [] } = useSpecialties();

  console.log(specialtiesData);

  const linkedEmployee = user
    ? (allEmployees.find((e) => e.email === user.email) ?? null)
    : null;

  const editUserSchemaBase = editUserSchema.superRefine((data, ctx) => {
    if (user?.roleId === USER_ROLES.DOCTOR) {
      if (!data.especialidades || data.especialidades.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Médico deve ter pelo menos uma especialidade",
          path: ["especialidades"],
        });
      }
    }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
    reset,
  } = useZodForm(editUserSchemaBase, {
    defaultValues: {
      username: "",
      email: "",
      roleId: 0,
      cpfOrCnpj: "",
      newPassword: "",
      confirmPassword: "",
      isEmployee: false,
      position: "",
      department: "",
      phone: "",
      hireDate: "",
      salary: "",
      dateOfBirth: "",
      gender: "",
      street: "",
      especialidades: [],
      streetNumber: "",
      city: "",
      state: "",
      zipCode: "",
      notes: "",
    },
  });

  const employee = useMemo(
    () => allEmployees.find((e) => e.email === user?.email) ?? null,
    [allEmployees, user?.email],
  );

  const especialidades = useMemo(
    () => specialtiesData?.map((s) => s.name) ?? [],
    [specialtiesData],
  );

  // Popula o form quando usuário (e possível funcionário) carregam
  useEffect(() => {
    if (!user) return;

    reset({
      username: user.username,
      email: user.email,
      roleId: user.roleId,
      cpfOrCnpj: user.cpf
        ? formatCpf(user.cpf)
        : user.cnpj
          ? formatCpfOrCpnj(user.cnpj)
          : "",
      newPassword: "",
      confirmPassword: "",
      isEmployee: !!employee,
      position: employee?.position ?? "",
      department: employee?.department ?? "",
      phone: employee?.phone ?? "",
      hireDate: employee?.hireDate ? employee.hireDate.slice(0, 10) : "",
      salary: employee?.salary != null ? String(employee.salary) : "",
      dateOfBirth: employee?.dateOfBirth ? employee.dateOfBirth.slice(0, 10) : "",
      gender: employee?.gender ?? "",
      street: employee?.street ?? "",
      streetNumber: employee?.streetNumber ?? "",
      city: employee?.city ?? "",
      state: employee?.state ?? "",
      zipCode: employee?.zipCode ?? "",
      notes: employee?.notes ?? "",
      especialidades: especialidades,
    });
  }, [user, employee, reset, especialidades]);

  const mutation = useMutation({
    mutationFn: async (data: EditUserInput) => {
      const digits = (data.cpfOrCnpj ?? "").replace(/\D/g, "");
      const cpf = digits.length === 11 ? digits : null;
      const cnpj = digits.length === 14 ? digits : null;

      // 1. Atualiza usuário
      const specialtyIds = data.especialidades
        ?.map((name) => allSpecialties?.find((s) => s.name === name)?.id)
        .filter((id): id is string => !!id);

      await userService.update(userId, {
        username: data.username,
        email: data.email,
        roleId: Number(data.roleId),
        cpf,
        cnpj,
        ...(data.newPassword && { password: data.newPassword }),
        ...(data.especialidades !== undefined && { specialtyIds }),
      });

      // 2. Funcionário: criar, atualizar ou ignorar
      if (data.isEmployee) {
        const empPayload = {
          name: data.username,
          email: data.email,
          cpf,
          phone: data.phone || null,
          position: data.position!,
          department: data.department || null,
          hireDate: data.hireDate || null,
          salary: data.salary ? Number(data.salary) : null,
          dateOfBirth: data.dateOfBirth || null,
          gender: data.gender || null,
          street: data.street || null,
          streetNumber: data.streetNumber || null,
          city: data.city || null,
          state: data.state || null,
          zipCode: data.zipCode || null,
          notes: data.notes || null,
        };

        if (linkedEmployee) {
          await employeeService.update(linkedEmployee.id, empPayload);
        } else {
          await employeeService.create(empPayload);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: USER_KEYS.detail(userId) });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_KEYS.all });
      navigate("/configuracoes/usuarios");
    },
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return {
    register,
    setValue,
    watch,
    errors,
    onSubmit,
    control,
    isLoadingUser,
    isSaving: mutation.isPending,
    saveError: mutation.error
      ? ((mutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao salvar. Tente novamente.")
      : null,
    loadError: loadError ? "Usuário não encontrado." : null,
    user,
    allSpecialties,
    linkedEmployee,
  };
}
