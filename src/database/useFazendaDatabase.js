import { consultarFazendasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useFazendaDatabase() {
  const db = useSQLiteContext();

  async function consultarFazendasLocal() {
    return await db.getAllAsync(
      `
        SELECT 
          numcompeso, nomfazenda, qualpesoliquido, codremarm, codremlav
        FROM tbfazenda
      `,
    );
  }

  async function atualizarFazendasLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const fazendas = await consultarFazendasServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbfazenda");

        if (fazendas.length > 0) {
          for (const fazenda of fazendas) {
            await db.runAsync(
              `
              INSERT INTO tbfazenda 
              (numcompeso, nomfazenda) 
              VALUES (?, ?);
              `,
              [fazenda.numcompeso, fazenda.nomfazenda],
            );
          }
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar fazendas: " + error);
    }
  }

  async function gravarPreferenciaFazendaLocal(pNumCompeso, pNomFazenda) {
    await db.runAsync(
      `
        UPDATE tbsistema
        SET numcompeso = ?, 
        nomfazenda = ?     
        `,
      [pNumCompeso, pNomFazenda],
    );
  }

  return { atualizarFazendasLocal, consultarFazendasLocal, gravarPreferenciaFazendaLocal };
}
