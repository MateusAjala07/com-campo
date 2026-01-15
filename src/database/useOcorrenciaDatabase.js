import { consultarOcorrenciasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useOcorrenciaDatabase() {
  const db = useSQLiteContext();

  async function atualizarOcorrenciasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const ocorrencias = await consultarOcorrenciasServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbregoco WHERE sincronizarapp = 'S'");

        if (ocorrencias.length > 0) {
          for (const ocorrencia of ocorrencias) {
            await db.runAsync(
              `
                INSERT INTO tbregoco
                (
                  idtipoco, tipoco, datoco, codnome, codlot, nomlot, codciclo, obs, codusu, imei,
                  lat, lng, numcompeso, status, sincronizarapp, idsinc, nsureg, idmobile, guid
                )
                VALUES
                (
                  ?, ?, ?, ?, ?, ?, ?. ?, ?, ?,
                  ?, ?, ?, ?, ?, ?, ?. ?, ?
                )
              `,
              [
                ocorrencia.idtipoco,
                ocorrencia.tipoco,
                ocorrencia.datoco,
                ocorrencia.codnome,
                ocorrencia.codlot,
                ocorrencia.nomlot,
                ocorrencia.codciclo,
                ocorrencia.obs,
                ocorrencia.codusu,
                ocorrencia.imei,
                ocorrencia.lat,
                ocorrencia.lng,
                ocorrencia.numcompeso,
                ocorrencia.status,
                ocorrencia.sincronizarapp,
                ocorrencia.idsinc,
                ocorrencia.nsureg,
                ocorrencia.idmobile,
                ocorrencia.guid,
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
      throw new Error("Erro ao sincronizar lançamentos de ocorrências: " + error);
    }
  }

  return { atualizarOcorrenciasLocal };
}
