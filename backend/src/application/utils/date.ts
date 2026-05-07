
export function formatarData(data: Date) {
  return data.toISOString().split(".")[0];
}