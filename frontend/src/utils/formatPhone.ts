export function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11) 
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatToInternationalPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const nationalNumber =
    cleaned.startsWith("55") &&
    (cleaned.length === 12 || cleaned.length === 13)
      ? cleaned.slice(2)
      : cleaned;
  const withoutTrunkPrefix = nationalNumber.startsWith("0")
    ? nationalNumber.slice(1)
    : nationalNumber;

  return `+55${withoutTrunkPrefix}`;
}
