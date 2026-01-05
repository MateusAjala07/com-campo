import { consultarFazendas } from "@/services/api";
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
    const response = await consultarFazendas();
    if (response.length > 0) {
      db.runAsync("DELETE FROM tbfazenda");

      for (const fazenda of response) {
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
