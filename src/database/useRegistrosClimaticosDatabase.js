import {
  consultarRegistrosClimaticosServidor,
  excluirRegistroClimaticoServidor,
  registrarRegistrosClimaticosServidor,
} from "@/services/api";
import { gerarTimestampAtual, listarInformacoesDispositivo } from "@/utils/funcoes";
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

  async function registrarRegistrosClimaticosLocal(pGuid, pPluviometro, pPrecipitacao, pData) {
    try {
      const dispositivo = await listarInformacoesDispositivo();

      await db.runAsync(
        `
          INSERT INTO tbregclima
          (
            guid, data, horreg, numcompeso, imei,
            status, idpluv, tempmin, tempmed, tempmax, umidade,
            precipitacao, lat, lng, sincronizarapp, codusuinc, nomusuinc, id_sinc
          )
          VALUES
          (
            ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?
          )
        `,
        [
          pGuid,
          pData,
          gerarTimestampAtual(),
          storage.getNumber("numCompeso"),
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

  async function editarRegistrosClimaticosLocal(pGuid, pPluviometro, pPrecipitacao, pData) {
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

  async function excluirRegistrosClimaticosLocal(pGuid) {
    try {
      await db.runAsync(
        `
        UPDATE tbregclima SET
        sincronizarapp = ?, status = ?
        WHERE guid = ?
        `,
        ["N", "C", pGuid],
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function uploadRegistrosClimaticos() {
    try {
      const registros = await db.getAllAsync(
        `
        SELECT * FROM tbregclima
        WHERE sincronizarapp = 'N'
      `,
      );

      for (let registro of registros) {
        if (registro.status === "C") {
          await excluirRegistroClimaticoServidor(registro.guid);

          await db.runAsync(`DELETE FROM tbregclima WHERE guid = ?`, [registro.guid]);
        } else if (registro.status === "A") {
          await registrarRegistrosClimaticosServidor(registro);

          await db.runAsync(`UPDATE tbregclima SET sincronizarapp = 'S' WHERE guid = ?`, [
            registro.guid,
          ]);
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function downloadRegistrosClimaticos() {
    try {
      const registros = await consultarRegistrosClimaticosServidor();

      for (let registro of registros) {
        const itemServer = await db.getAllAsync(
          `SELECT sincronizarapp FROM tbregclima WHERE guid = ?`,
          [registro.guid],
        );

        if (itemServer.length === 0) {
          await db.runAsync(
            `
              INSERT INTO tbregclima 
              (
                guid, data, horreg, numcompeso, imei, idmobile,
                status, idpluv, tempmin, tempmed, tempmax, umidade, precipitacao,
                lat, lng, sincronizarapp, codusuinc, nomusuinc, id_sinc, nsureg
              )                   
              VALUES 
              (
                ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?, ?
              )
            `,
            [
              registro.guid,
              registro.data,
              registro.horreg,
              registro.numcompeso,
              registro.imei,
              registro.idmobile,
              registro.status,
              registro.idpluv,
              registro.tempmin,
              registro.tempmed,
              registro.tempmax,
              registro.umidade,
              registro.precipitacao,
              registro.lat,
              registro.lng,
              "S",
              registro.codusuinc,
              registro.nomusuinc,
              registro.id_sinc,
              registro.nsureg,
            ],
          );
        } else if (itemServer.length > 0 && itemServer[0].sincronizarapp === "S") {
          await db.runAsync(
            `
              UPDATE tbregclima SET              
                data = ?, horreg = ?, numcompeso = ?, imei = ?, idmobile = ?,
                status = ?, idpluv = ?, tempmin = ?, tempmed = ?, tempmax = ?, umidade = ?, precipitacao = ?,
                lat = ?, lng = ?, codusuinc = ?, nomusuinc = ?, id_sinc = ?, nsureg = ?
              WHERE guid = ? AND sincronizarapp = 'S'                   
            `,
            [
              registro.data,
              registro.horreg,
              registro.numcompeso,
              registro.imei,
              registro.idmobile,
              registro.status,
              registro.idpluv,
              registro.tempmin,
              registro.tempmed,
              registro.tempmax,
              registro.umidade,
              registro.precipitacao,
              registro.lat,
              registro.lng,
              registro.codusuinc,
              registro.nomusuinc,
              registro.id_sinc,
              registro.nsureg,
              registro.guid,
            ],
          );
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return {
    consultarRegistrosClimaticosLocal,
    registrarRegistrosClimaticosLocal,
    editarRegistrosClimaticosLocal,
    excluirRegistrosClimaticosLocal,
    uploadRegistrosClimaticos,
    downloadRegistrosClimaticos,
  };
}
