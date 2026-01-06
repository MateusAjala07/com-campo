import { consultarUsuariosServidor } from "@/services/api";
import { useSQLiteContext } from "expo-sqlite";

export default function useUsuarioDatabase() {
  const db = useSQLiteContext();

  async function consultarUsuarioLocal(codusu) {
    try {
      const response = await db.getFirstAsync(`SELECT * FROM tbusuarios WHERE codusu = ?`, [
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
        `SELECT codusu,nomusu,senusu,ususuper,id,acessomobile FROM tbusuarios`,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function atualizarUsuariosLocal() {
    try {
      await db.execAsync(`DELETE FROM tbusuarios`);
      const usuarios = await consultarUsuariosServidor();

      for (const usuario of usuarios) {
        await db.runAsync(
          `
          INSERT INTO tbusuarios 
            (codusu, nomusu, senusu, ususuper, acessomobile) 
          VALUES (?, ?, ?, ?, ?);
          `,
          [
            usuario.codusu,
            usuario.nomusu,
            usuario.senusu,
            usuario.ususuper,
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
