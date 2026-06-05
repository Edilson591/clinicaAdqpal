import * as git from "isomorphic-git";
import http from "isomorphic-git/http/node";
import * as fs from "fs";
import * as path from "path";
import AdmZip from "adm-zip";
import * as os from "os";

export interface SusProcedureData {
  codigo: string;
  nome: string;
  modalidade: string;
}

export class SusSyncService {
  constructor(private readonly repoUrl: string) {}

  async fetchAndParse(): Promise<SusProcedureData[]> {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "sigtap-"));
    try {
      console.log("[SusSync] Clonando repositório SIGTAP...");
      await git.clone({
        fs,
        http,
        dir: tmpDir,
        url: this.repoUrl,
        singleBranch: true,
        depth: 1,
      });

      const tabelasDir = path.join(tmpDir, "tabelas");
      const arquivos = fs.readdirSync(tabelasDir);

      const ultimoZip = arquivos
        .filter((f) => f.startsWith("TabelaUnificada_") && f.endsWith(".zip"))
        .sort()
        .pop();

      if (!ultimoZip) {
        throw new Error("Nenhum arquivo ZIP encontrado no repositório.");
      }

      console.log(`[SusSync] ZIP encontrado: ${ultimoZip}`);

      const zip = new AdmZip(path.join(tabelasDir, ultimoZip));
      const entries = zip.getEntries();

      const txtEntry = entries.find((e) =>
        e.entryName.toLowerCase().includes("tb_procedimento.txt"),
      );

      if (!txtEntry) {
        throw new Error("tb_procedimento.txt não encontrado no ZIP.");
      }

      const conteudo = zip.readAsText(txtEntry, "latin1");
      const linhas = conteudo.split(/\r?\n/);

      const procedimentos: SusProcedureData[] = [];

      for (const linha of linhas) {
        if (linha.length < 260) continue;

        const codigo = linha.substring(0, 10).trim();
        const nome = linha.substring(10, 260).trim();

        if (!codigo || !/^\d+$/.test(codigo)) continue;

        const ehUltrassom = codigo.startsWith("020502");
        const ehTomografia = codigo.startsWith("0206");
        const ehRessonancia = codigo.startsWith("0207");

        if (ehUltrassom || ehTomografia || ehRessonancia) {
          let modalidade = "Ultrassonografia";
          if (ehTomografia) modalidade = "Tomografia Computadorizada";
          if (ehRessonancia) modalidade = "Ressonância Magnética";

          procedimentos.push({ codigo, nome, modalidade });
        }
      }

      console.log(`[SusSync] ${procedimentos.length} procedimentos extraídos.`);
      return procedimentos;
    } finally {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    }
  }
}
