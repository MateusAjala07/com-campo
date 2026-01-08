import { consultarSafrasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useSafrasDatabase() {
  const db = useSQLiteContext();

  async function consultarSafrasLocal(pAno) {
    try {
      let sql = `
      SELECT numcompeso, descricao, codproint, codrem,
      datini, datfin, idregsafra, codciclo, id
      FROM tbsafras 
      `;

      if (pAno) {
        sql += `
        WHERE STRFTIME('%Y', datini) = ?
        OR STRFTIME('%y', datfin) = ?
        `;
      }

      return await db.getAllAsync(sql, [pAno, pAno]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function atualizarSafrasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) return;

      const safras = await consultarSafrasServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbsafras");

        if (safras.length > 0) {
          for (const safra of safras) {
            await db.runAsync(
              `
              INSERT INTO tbsafras
                (
                  id, numcompeso, descricao, codproint, 
                  codrem, datini, datfin, idregsafra, codciclo
                )
              VALUES
                (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
              [
                safra.id,
                safra.numcompeso,
                safra.descricao,
                safra.codproint,
                safra.codrem,
                safra.datini,
                safra.datfin,
                safra.idregsafra,
                safra.codciclo,
              ],
            );
          }
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw new Error(error.message);
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar safras:", error.message);
    }
  }

  return { consultarSafrasLocal, atualizarSafrasLocal };
}
