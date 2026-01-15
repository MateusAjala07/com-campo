import { consultarLotesCicloServidor, consultarLotesServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useLoteDatabase() {
  const db = useSQLiteContext();

  async function atualizarLotesLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const lotes = await consultarLotesServidor();
      const lotesCiclo = await consultarLotesCicloServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tblotes");
        if (lotes.length > 0) {
          for (const lote of lotes) {
            await db.runAsync(
              `
                INSERT INTO tblotes
                (numcompeso, codciclo, idlot, codlot, nomlot, codnome, qtdarealote)
                VALUES
                (?, ?, ?, ?, ?, ?, ?)
              `,
              [
                lote.numcompeso,
                lote.codciclo,
                lote.idlot,
                lote.codlot,
                lote.nomlot,
                lote.codnome,
                lote.qtdarealote,
              ],
            );
          }
        }

        await db.runAsync("DELETE FROM tblotesciclo");
        if (lotesCiclo.length > 0) {
          for (const loteCiclo of lotesCiclo) {
            await db.runAsync(
              `
                INSERT INTO tblotesciclo
                (numcompeso, codciclo, codlot, nomlot, codnome, qtdarealote)
                VALUES
                (?, ?, ?, ?, ?, ?)
              `,
              [
                loteCiclo.numcompeso,
                loteCiclo.codciclo,
                loteCiclo.codlot,
                loteCiclo.nomlot,
                loteCiclo.codnome,
                0,
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
      throw error;
    }
  }

  return { atualizarLotesLocal };
}
