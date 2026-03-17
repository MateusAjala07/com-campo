import { consultarMercadoriasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function useMercadoriaDatabase() {
  const db = useSQLiteContext();

  async function atualizarMercadoriasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const mercadorias = await consultarMercadoriasServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbmercadorias");

        if (mercadorias.length > 0) {
          for (const mercadoria of mercadorias) {
            await db.runAsync(
              `
                INSERT INTO tbmercadorias
                (
                  codclasselan, codproid, nompro, unipro, codgru, nomgru,
                  codsub, dessub, nommar, codgrubens, nomgrubens, placa,
                  codpatrimonio, numcompeso, numfab, tipitem, sincronizarapp
                )
                VALUES
                (
                  ?, ?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?, ?,
                  ?, ?, ?, ?, ?
                )
              `,
              [
                mercadoria.codclasselan,
                mercadoria.codproid,
                mercadoria.nompro,
                mercadoria.unipro,
                mercadoria.codgru,
                mercadoria.nomgru,
                mercadoria.codsub,
                mercadoria.dessub,
                mercadoria.nommar,
                mercadoria.codgrubens,
                mercadoria.nomgrubens,
                mercadoria.placa,
                mercadoria.codpatrimonio,
                storage.getNumber("numCompeso"),
                mercadoria.numfab,
                mercadoria.tipitem,
                "S",
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
      throw new Error("Erro ao sincronizar mercadorias: " + error);
    }
  }

  async function consultarMaquinasLocal(coluna = "*") {
    return await db.getAllAsync(
      `
        SELECT ${coluna}
          FROM tbmercadorias
        WHERE codclasselan = 2
        ORDER BY nompro, placa
      `,
    );
  }

  async function consultarProdutosLocal(coluna = "*", tipoItem) {
    return await db.getAllAsync(
      `
        SELECT ${coluna} 
          FROM tbmercadorias
        WHERE codclasselan = 1
          AND tipitem = ?
      `,
      [tipoItem],
    );
  }

  return { atualizarMercadoriasLocal, consultarMaquinasLocal, consultarProdutosLocal };
}
