import { consultarDepositosServidor, consultarEstoquesServidor } from "@/services/api";
import { gerarTimestampAtual, redeEServidorAtivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function useDepositoDatabase() {
  const db = useSQLiteContext();

  async function atualizarDepositosLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const depositos = await consultarDepositosServidor();
      const estoque = await consultarEstoquesServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync("DELETE FROM tbdepositos");

        if (depositos.length > 0) {
          for (const deposito of depositos) {
            await db.runAsync(
              `
                INSERT INTO tbdepositos
                (coddep, nomdep, numcompeso)
                VALUES
                (?, ?, ?)
              `,
              [deposito.coddep, deposito.nomdep, deposito.numcompeso],
            );
          }
        }

        await db.runAsync("DELETE FROM tbestoque");

        if (estoque.length > 0) {
          for (const e of estoque) {
            await db.runAsync(
              `
                INSERT INTO tbestoque
                (coddep, codproid, nompro, unipro, estoque)
                VALUES
                (?, ?, ?, ?, ?)
              `,
              [e.coddep, e.codproid, e.nompro, e.unipro, e.estoque],
            );
          }
        }

        await db.runAsync("COMMIT");

        const agora = new Date();
        storage.set("ultAtuEstDep", agora.toLocaleDateString("pt-BR"));
        storage.set("horaUltAtuEstDep", gerarTimestampAtual());
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar deposito: " + error);
    }
  }

  async function consultarDepositosLocal(codDep) {
    try {
      if (!codDep) {
        return await db.getAllAsync(
          `
            SELECT coddep,nomdep,numcompeso
            FROM tbdepositos
          `,
        );
      } else {
        return await db.getAllAsync(
          `
            SELECT coddep,nomdep,numcompeso
            FROM tbdepositos WHERE coddep = ?
          `,
          [codDep],
        );
      }
    } catch (error) {
      throw new Error("Erro ao listar depositos");
    }
  }

  return { atualizarDepositosLocal, consultarDepositosLocal };
}
