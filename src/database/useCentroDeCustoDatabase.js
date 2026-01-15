import { consultarCentroDeCustosServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useCentroDeCustoDatabase() {
  const db = useSQLiteContext();

  async function atualizarCentroDeCustosLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const centroDeCustos = await consultarCentroDeCustosServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbcentrocusto");

        if (centroDeCustos.length > 0) {
          for (const centroDeCusto of centroDeCustos) {
            await db.runAsync(
              `
                INSERT INTO tbcentrocusto
                (codcentro, nomcentro, coddep)
                VALUES
                (?, ?, ?)
              `,
              [centroDeCusto.codcentro, centroDeCusto.nomcentro, centroDeCusto.coddep],
            );
          }
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar centro de custos: " + error);
    }
  }

  return { atualizarCentroDeCustosLocal };
}
