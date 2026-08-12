import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(process.cwd(), ".env.production.local"),
});
// Substitua "NOME_DA_SUA_VARIAVEL" pelo nome exato da chave cadastrada na Vercel
const variableName = "SMTP_PASS";
const secretValue = process.env[variableName];

console.log("----------------------------------------");
console.log(`Valor de ${variableName}:`, secretValue);
console.log("----------------------------------------");
