import { Worker, type Job } from "bullmq";
import fs from "fs";
import path from "path";

import prisma from "../database/prismaClient";
import { NOTA_FISCAL_QUEUE, type NotaFiscalJobData } from "./NotaFiscalQueue";

import { getBullMQRedis } from "../cache/RedisBullMQ";
import { toNotaFiscalXML } from "../../application/mappers/xmlMapper";
import { getNotaFiscalGateway } from "../services/getNotaFiscalGateway";

// ─── Helpers ──────────────────────────────────────────────────────────────────

// function buildDescricao(servico: string, observacoes?: string | null) {
//   return observacoes ? `${servico} - ${observacoes}` : servico;
// }

function ensureOnlyNumbers(value?: string | null): string {
  return (value ?? "").replace(/\D/g, "");
}

// ─── Worker ───────────────────────────────────────────────────────────────────

export function startNotaFiscalWorker(): Worker<NotaFiscalJobData> {
  const worker = new Worker<NotaFiscalJobData>(
    NOTA_FISCAL_QUEUE,
    async (job: Job<NotaFiscalJobData>) => {
      const { notaFiscalId } = job.data;

      console.info(`[NFSe] Processando nota ${notaFiscalId}`);

      // 🔎 buscar dados
      const nota = await prisma.notaFiscal.findUnique({
        where: { id: notaFiscalId },
        include: {
          patient: true,
        },
      });

      if (!nota) {
        throw new Error(`Nota ${notaFiscalId} não encontrada`);
      }

      if (!nota.patient) {
        throw new Error(`Paciente da nota ${notaFiscalId} não encontrado`);
      }

      // 👉 aqui tu pode ajustar se empresa vier de config/env
      const empresa = await prisma.empresaConfig.findFirst();

      if (!empresa) {
        throw new Error("Empresa não configurada");
      }

      // 🔥 gerar XML
      const xml = toNotaFiscalXML({
        nota: {
          id: nota.id,
          numero: nota.numero,
          servico: nota.servico,
          valor: Number(nota.valor),
          observacoes: nota.observacoes,
          dataEmissao: new Date(),
        },
        paciente: {
          nome: nota.patient.name,
          cpf: ensureOnlyNumbers(nota.patient.cpf),
        },
        empresa: {
          razaoSocial: empresa.razaoSocial,
          cnpj: ensureOnlyNumbers(empresa.cnpj),
          inscricaoMunicipal: empresa.inscricaoMunicipal,
          municipioCodigo: empresa.municipioCodigo,
        },
      });


      const filePath = path.join("/tmp", `nota-${notaFiscalId}.xml`);
      fs.writeFileSync(filePath, xml);

      try {
        // 📡 enviar
        const gateway = getNotaFiscalGateway();

        const response = await gateway.enviar(filePath);

        // console.info(`[NFSe] Resposta job ${job.id}:`, response);

        if (response.status === "processado") {
          if (!response.notas) {
            throw new Error("Notas não encontradas na resposta");
          }
          const notaProcessada = Object.values(response.notas)[0];

          await prisma.notaFiscal.update({
            where: { id: notaFiscalId },
            data: {
              status: "EMITIDA",
              dataEmissao: new Date(),
              numero: notaProcessada.numero,
              pdfUrl: notaProcessada.url,
            },
          });

          console.info(`[NFSe] Nota ${notaFiscalId} emitida com sucesso`);
        } else if (response.status === "enviado") {
          await prisma.notaFiscal.update({
            where: { id: notaFiscalId },
            data: {
              status: "PROCESSANDO",
            },
          });

          console.info(`[NFSe] Nota ${notaFiscalId} em processamento`);
        } else {
          throw new Error(response.detalhes);
        }
      } catch (err) {
        await prisma.notaFiscal.update({
          where: { id: notaFiscalId },
          data: {
            status: "ERRO",
          },
        });

        console.error(
          `[NFSe] Erro job ${job.id}:`,
          err instanceof Error ? err.message : err,
        );

        throw err; // 🔥 garante retry
      } finally {
        // 🧹 limpar arquivo
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    },
    {
      connection: getBullMQRedis(),
      concurrency: 3,
    },
  );

  worker.on("completed", (job) => {
    console.info(`[NFSe] Job ${job.id} concluído`);
  });

  worker.on("failed", (job, err) => {
    console.error(
      `[NFSe] Job ${job?.id} falhou (tentativa ${job?.attemptsMade}/${job?.opts.attempts}): ${err.message}`,
    );
  });

  console.info("[NFSe] NotaFiscalWorker iniciado");
  return worker;
}
