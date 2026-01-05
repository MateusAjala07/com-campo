import { listarInformacoesDispositivo } from "@/utils/funcoes";
import { useSQLiteContext } from "expo-sqlite";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function useRegistrosClimaticosDatabase() {
  const db = useSQLiteContext();

  async function consultarRegistrosClimaticosLocal() {
    try {
      return await db.getAllAsync(
        `
          SELECT
            data, idpluv, precipitacao, nomusuinc, id, sincronizarapp, guid
          FROM tbregclima
            WHERE status <> 'C'
            AND id > 0
          ORDER BY datreg desc, id desc
        `,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function registrarClima(pGuid, pPluviometro, pPrecipitacao, pData) {
    try {
      const agora = new Date();
      const horas = String(agora.getHours()).padStart(2, "0");
      const minutos = String(agora.getMinutes()).padStart(2, "0");
      const segundos = String(agora.getSeconds()).padStart(2, "0");

      const horario = `${horas}:${minutos}:${segundos}`;

      const dispositivo = await listarInformacoesDispositivo();

      await db.runAsync(
        `
          INSERT INTO tbregclima
          (
            guid, guid_sinc, data, horreg, numcompeso, imei,
            status, idpluv, tempmin, tempmed, tempmax, umidade,
            precipitacao, lat, lng, sincronizarapp, codusuinc, nomusuinc, id_sinc
          )
          VALUES
          (
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?
          )
        `,
        [
          pGuid,
          pGuid,
          pData,
          horario,
          storage.getString("numCompeso"),
          dispositivo.id,
          "A",
          pPluviometro,
          0,
          0,
          0,
          0,
          pPrecipitacao,
          0,
          0,
          "N",
          storage.getString("codUsu"),
          storage.getString("nomUsu"),
          0,
        ],
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function editarClima(pGuid, pPluviometro, pPrecipitacao, pData) {
    try {
      await db.runAsync(
        `
          UPDATE tbregclima SET
            data = ?, idpluv = ?, precipitacao = ?,
            status = ?, sincronizarapp = ?
          WHERE guid = ? 
        `,
        [pData, pPluviometro, pPrecipitacao, "A", "N", pGuid],
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { consultarRegistrosClimaticosLocal, registrarClima, editarClima };
}
