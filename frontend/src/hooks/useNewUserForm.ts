import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useZodForm } from "./useZodForm";
import { newUserSchema, type NewUserInput } from "../validate/newUser.schema";
import { userService } from "../services/User";
import { employeeService } from "../services/Employee";
import { formatCpfOrCpnj } from "../utils/formatCpf";
import { USER_KEYS } from "./useUsers";
import { formatCep } from "../utils/formatCep";
import { ESTADOS } from "../data/state";
import { useSpecialties } from "./useSpecialties";

export function useNewUserForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allSpecialties = [] } = useSpecialties();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useZodForm(newUserSchema, {
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      roleId: "",
      cpfOrCnpj: "",
      isEmployee: false,
      especialidades: [],
      position: "",
      department: "",
      phone: "",
      hireDate: "",
      salary: "",
      dateOfBirth: "",
      gender: "",
      street: "",
      streetNumber: "",
      city: "",
      state: ESTADOS[0],
      zipCode: "",
      notes: "",
    },
  });

  const isEmployee = watch("isEmployee");

  const mutation = useMutation({
    mutationFn: async (data: NewUserInput) => {
      const digits = (data.cpfOrCnpj ?? "").replace(/\D/g, "");
      const cpf = digits.length === 11 ? digits : null;
      const cnpj = digits.length === 14 ? digits : null;

      // 1. Cria o usuário
      const specialtyIds = data.especialidades
        ?.map((name) => allSpecialties.find((s) => s.name === name)?.id)
        .filter((id): id is string => !!id);

      const newUser = await userService.register({
        username: data.username,
        email: data.email,
        password: data.password,
        roleId: Number(data.roleId),
        cpf,
        cnpj,
        ...(specialtyIds !== undefined && specialtyIds.length > 0 && { specialtyIds }),
      });

      // 2. Se for funcionário, cria o employee com os mesmos dados base + campos extras
      if (data.isEmployee) {
        await employeeService.create({
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
          zipCode: formatCep(data.zipCode ?? "") || null,
          notes: data.notes || null,
        });
      }

      return newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      navigate("/configuracoes/usuarios");
    },
  });

  const onSubmit = handleSubmit((data) => mutation.mutate(data));

  return {
    register,
    setValue,
    watch,
    errors,
    control,
    onSubmit,
    isEmployee,
    isSaving: mutation.isPending,
    saveError: mutation.error
      ? ((mutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao cadastrar. Tente novamente.")
      : null,
    formatCpfOrCpnj,
    allSpecialties,
  };
}
