import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useZodForm } from "./useZodForm";
import {
  newEmployeeSchema,
  type NewEmployeeInput,
} from "../validate/newEmployee.schema";
import { employeeService } from "../services/Employee";
import { userService } from "../services/User";
import { ESTADOS } from "../data/state";

const EMPLOYEE_KEYS = { all: ["employees"] as const };

export function useNewEmployeeForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useZodForm(newEmployeeSchema, {
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
      state: ESTADOS[1],
      zipCode: "",
      notes: "",
      hasSystemAccess: false,
      username: "",
      password: "",
      confirmPassword: "",
      roleId: "",
    },
  });

  const hasSystemAccess = watch("hasSystemAccess");

  const mutation = useMutation({
    mutationFn: async (data: NewEmployeeInput) => {
      // 1. Cria o funcionário

      const prevData = {
        ...data,
        cpf: data?.cpf?.replace(/\D/g, ""),
        phone: data.phone?.replace(/\D/g, ""),
        gender: data.gender || "feminino",
        dateOfBirth: data.dateOfBirth
          ? new Date(data.dateOfBirth).toISOString()
          : null,
      };
  
      const employee = await employeeService.create({
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
        city: prevData.city || null,
        state: prevData.state || null,
        zipCode: prevData.zipCode || null,
        notes: prevData.notes || null,
      });

      // 2. Se tiver acesso ao sistema, cria o usuário vinculado
      if (prevData.hasSystemAccess) {
        const cpfDigits = (prevData.cpf ?? "").replace(/\D/g, "");
        await userService.register({
          username: prevData.username!,
          email: prevData.email || prevData.username!,
          password: prevData.password!,
          roleId: Number(prevData.roleId),
          cpf: cpfDigits.length === 11 ? cpfDigits : null,
          cnpj: null,
        });
      }

      return employee;
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
    onSubmit: handleSubmit((data) => mutation.mutate(data)),
    isSaving: mutation.isPending,
    saveError: mutation.error
      ? ((mutation.error as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? "Erro ao cadastrar.")
      : null,
  };
}
