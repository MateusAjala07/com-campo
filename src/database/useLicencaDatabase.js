import { listarInformacoesDispositivo, listarIP } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";

export default function useLicencaDatabase() {
  const db = useSQLiteContext();

  async function verificarLicenca() {
    try {
      const dispositivo = await listarInformacoesDispositivo();
      return await db.getFirstAsync(`SELECT * FROM licenca WHERE imei = ?`, [
        dispositivo.id,
      ]);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function gravarLicenca(pChave, pCodAcesso) {
    try {
      let dispositivo = await listarInformacoesDispositivo();
      const ip = await listarIP();
      await db.runAsync(
        `INSERT INTO licenca (imei, ip, chave, codacesso) VALUES (?, ?, ?, ?)`,
        [dispositivo.id, ip, pChave, pCodAcesso],
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { verificarLicenca, gravarLicenca };
}
