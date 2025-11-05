import { useSQLiteContext } from "expo-sqlite";

export default function useLoginDatabase() {
  const db = useSQLiteContext();

  async function verificarSistema() {
    try {
      return await db.getFirstAsync(`SELECT * FROM SISTEMA`);
    } catch (error) {
      throw new Error(error.message || "Erro ao obter informações do sistema.");
    }
  }

  return { verificarSistema };
}
