import { consultarTipoOcorrenciasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useTipoOcorrenciaDatabase() {
  const db = useSQLiteContext();

  async function atualizarTipoOcorrenciasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const tipoOcorrencias = await consultarTipoOcorrenciasServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbtipoco");

        if (tipoOcorrencias.length > 0) {
          for (const tipoOcorrencia of tipoOcorrencias) {
            await db.runAsync(
              `
                INSERT INTO tbtipoco
                (
                  id, descricao, idgruoco, desgruoco, idsubgruoco, dessubgruoco, idcultura
                )
                VALUES
                (
                  ?, ?, ?, ?, ?, ?, ?
                )
              `,
              [
                tipoOcorrencia.id,
                tipoOcorrencia.descricao,
                tipoOcorrencia.idgruoco,
                tipoOcorrencia.desgruoco,
                tipoOcorrencia.idsubgruoco,
                tipoOcorrencia.dessubgruoco,
                tipoOcorrencia.idcultura,
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
      throw new Error("Erro ao sincronizar tipo ocorrência: " + error);
    }
  }

  return { atualizarTipoOcorrenciasLocal };
}
