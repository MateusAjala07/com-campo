import { consultarUsuarios } from "@/services/api";
import { useSQLiteContext } from "expo-sqlite";

export default function useUsuarioDatabase() {
  const db = useSQLiteContext();

  async function consultarUsuarioLocal(codusu) {
    try {
      const response = await db.getFirstAsync(`SELECT * FROM arqusuarios WHERE codusu = ?`, [
        codusu,
      ]);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function consultarUsuariosLocal() {
    try {
      return await db.getAllAsync(
        `SELECT codusu,nomusu,senusu,ususuper,id,acessomobile,libcliblq,libdesven,idmotorista,codven,nommot FROM arqusuarios`,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function atualizarUsuariosLocal() {
    try {
      await db.execAsync(`DELETE FROM arqusuarios`);
      const usuarios = await consultarUsuarios();

      for (const usuario of usuarios) {
        await db.runAsync(
          `
          INSERT INTO arqusuarios 
            (codusu, nomusu, senusu, ususuper, libcliblq, libdesven, idmotorista, nommot, acessomobile) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
          `,
          [
            usuario.codusu,
            usuario.nomusu,
            usuario.senusu,
            usuario.ususuper,
            usuario.libcliblq ?? 0,
            usuario.libdesven ?? 0,
            usuario.nommot ?? "",
            usuario.acessomobile ?? "N",
          ],
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return {
    consultarUsuarioLocal,
    consultarUsuariosLocal,
    atualizarUsuariosLocal,
  };
}
