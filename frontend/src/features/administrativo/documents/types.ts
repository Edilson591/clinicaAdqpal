import type { ComponentType } from "react";

export type AdministrativeDocumentId = string;

export type AdministrativeField = {
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  type?: "text" | "textarea" | "date" | "phone" | "select";
  options?: { value: string; label: string }[];
  full?: boolean;
  rows?: number;
};

export type AdministrativeValues = Record<string, string>;

export type PrintTemplateProps = {
  values: AdministrativeValues;
  getValue: (name: string, fallback?: string) => string;
};

export type AdministrativeDocumentConfig = {
  id: AdministrativeDocumentId;
  title: string;
  description: string;
  group: string;
  fields: AdministrativeField[];
  Template: ComponentType<PrintTemplateProps>;
};
