import { consultarFuncionariosServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useFuncionarioDatabase() {
  const db = useSQLiteContext();

  async function atualizarFuncionariosLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const funcionarios = await consultarFuncionariosServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbfuncionarios");

        if (funcionarios.length > 0) {
          for (const funcionario of funcionarios) {
            await db.runAsync(
              `
                INSERT INTO tbfuncionarios
                (codfun, nomfun, apelido, situacao, numcompeso)
                VALUES
                (?, ?, ?, ?, ?)
              `,
              [
                funcionario.codfun,
                funcionario.nomfun,
                funcionario.apelido,
                funcionario.situacao,
                funcionario.numcompeso,
              ],
            );
          }
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar funcionários: " + error);
    }
  }

  async function consultarFuncionariosLocal(coluna = "*"){
    return await db.getAllAsync(
      `
        SELECT ${coluna}
          FROM tbfuncionarios
        ORDER BY nomfun
      `
    )
  }

  return { atualizarFuncionariosLocal, consultarFuncionariosLocal };
}
