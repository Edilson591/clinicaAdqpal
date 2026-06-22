import { z } from "zod";
import type { AdministrativeDocumentConfig } from "../features/administrativo/documents/types";

const MAX_TEXT_LENGTH = 12000;

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function isValidCpf(value: string) {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calcDigit = (base: string, factor: number) => {
    const total = base
      .split("")
      .reduce((sum, digit) => sum + Number(digit) * factor--, 0);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  return calcDigit(cpf.slice(0, 9), 10) === Number(cpf[9]) && calcDigit(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

function isCpfField(name: string, label: string) {
  return `${name} ${label}`.toLowerCase().includes("cpf");
}

function isCnpjField(name: string, label: string) {
  return `${name} ${label}`.toLowerCase().includes("cnpj");
}

function isPhoneField(name: string, label: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return normalized.includes("telefone") || normalized.includes("celular") || normalized.includes("phone") || normalized.includes("contato");
}

function isCurrencyField(name: string, label: string) {
  return name.toLowerCase() === "valor" && label.toLowerCase() === "valor";
}

function isNumericField(name: string, label: string) {
  const normalized = `${name} ${label}`.toLowerCase();
  return normalized.includes("rg") || normalized.includes("numero do oficio") || normalized.includes("número do oficio") || normalized.includes("numero de linhas") || normalized.includes("número de linhas");
}

export function createAdministrativeDocumentSchema(document: AdministrativeDocumentConfig) {
  const shape = document.fields.reduce<Record<string, z.ZodType<string>>>((acc, field) => {
    let schema = z.string().max(MAX_TEXT_LENGTH, "Texto muito longo.");

    if (field.required) {
      schema = schema.trim().min(1, `${field.label} é obrigatório.`).max(MAX_TEXT_LENGTH, "Texto muito longo.");
    }

    if (isCpfField(field.name, field.label)) {
      schema = schema.refine((value) => !value.trim() || /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value), "CPF inválido (000.000.000-00).");
      schema = schema.refine((value) => !value.trim() || isValidCpf(value), "CPF inválido.");
    }

    if (isCnpjField(field.name, field.label)) {
      schema = schema.refine((value) => !value.trim() || /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(value), "CNPJ inválido (00.000.000/0000-00).");
    }

    if (field.type === "phone" || isPhoneField(field.name, field.label)) {
      schema = schema.refine((value) => !value.trim() || /^\(\d{2}\) \d{5}-\d{4}$/.test(value), "Telefone inválido ((00) 00000-0000).");
    }

    if (isCurrencyField(field.name, field.label)) {
      schema = schema.refine((value) => !value.trim() || /^R\$\s?\d{1,3}(\.\d{3})*,\d{2}$/.test(value), "Valor inválido. Use o formato R$ 0,00.");
    }

    if (isNumericField(field.name, field.label)) {
      schema = schema.refine((value) => !value.trim() || /^\d+$/.test(value), `${field.label} deve conter apenas números.`);
    }

    acc[field.name] = schema;
    return acc;
  }, {});

  return z.object(shape);
}
