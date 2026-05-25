export function formatPhone(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11) 
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

export function formatToInternationalPhone(phone: string): string {
  // 1. Remove tudo o que não for número (parênteses, hifens, espaços)
  const cleaned = phone.replace(/\D/g, "");

  // 2. Se o número já começar com 55 e tiver o tamanho de um celular (12 ou 13 dígitos), apenas adiciona o '+'
  if (cleaned.startsWith("55") && (cleaned.length === 12 || cleaned.length === 13)) {
    return `+${cleaned}`;
  }

  // 3. Caso contrário, assume que é um número nacional e adiciona o '+55' na frente
  return `+55${cleaned}`;
}
