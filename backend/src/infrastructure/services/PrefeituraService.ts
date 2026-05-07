import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import { PrefeituraResponse } from "../../domain/entities/Prefeitura";
import { INotaFiscalGateway } from "../../domain/services/INotaFiscalGateway";

export class PrefeituraService implements INotaFiscalGateway {
  private url =
    process.env.NFE_URL ??
    "http://nfe-homologacao.prefeitura.info/webservice/ws_importarnfe_abrasf.php";

  private login = process.env.NFE_LOGIN!;
  private senha = process.env.NFE_SENHA!;

  async enviar(filePath: string): Promise<PrefeituraResponse> {
    const form = new FormData();

    // console.log("Credenciais", this.login, this.senha);

    form.append("login", this.login);
    form.append("senha", this.senha);
    form.append("assincrono", "N"); // pode mudar depois
    form.append("arquivo", fs.createReadStream(filePath));


    try {
      const response = await axios.post(this.url, form, {
        headers: {
          ...form.getHeaders(),
          "Content-Length": await new Promise<number>((resolve, reject) => {
            form.getLength((err, length) => {
              if (err) reject(err);
              resolve(length);
            });
          }),
        },
        maxBodyLength: Infinity,
      });

      console.info("[NFSe] data:", response.data);

      return response.data;
    } catch (error) {
      console.error("[PrefeituraService] erro ao enviar:", error);

      throw new Error("Erro ao enviar NFSe para prefeitura");
    }
  }
}
