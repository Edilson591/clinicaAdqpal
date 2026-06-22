import apiCid from "./apiCid";

export type CID10Record = {
  codigo: string; // "A00.1"
  descricao: string;
  capitulo: string; // "I" (romano)
  capituloDesc: string;
  grupo: string; // "A00-A09"
  grupoDesc: string;
  categoria: string; // "A00"
  categoriaDesc: string;
  tipo: "categoria" | "subcategoria";
};

export const cidService = {
  getAll: async (): Promise<CID10Record[]> => {
    const res = await apiCid.get<CID10Record[]>("/cid10.json");
    return res.data;
  },
};
