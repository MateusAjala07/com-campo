import { consultarCicloDeProducaoServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useCicloDeProducaoDatabase() {
  const db = useSQLiteContext();

  async function atualizarCicloDeProducaoLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const ciclosDeProducoes = await consultarCicloDeProducaoServidor();
      
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbciclosprod");

        if (ciclosDeProducoes.length > 0) {
          for (const cicloDeProducao of ciclosDeProducoes) {
            await db.runAsync(
              `
                INSERT INTO tbciclosprod
                (codciclo, desciclo, datini, datfin)
                VALUES
                (?, ?, ?, ?)
              `,
              [
                cicloDeProducao.codciclo,
                cicloDeProducao.desciclo,
                cicloDeProducao.datini,
                cicloDeProducao.datfin,
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
      throw new Error("Erro ao sincronizar ciclo de produção: " + error);
    }
  }

  return { atualizarCicloDeProducaoLocal };
}
