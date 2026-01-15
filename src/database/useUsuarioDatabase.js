import { consultarUsuariosServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
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
        `
          SELECT 
            codusu,nomusu,senusu,ususuper,id,acessomobile 
          FROM tbusuarios
        `,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function atualizarUsuariosLocal() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw redeEServidor.mensagem;

      const usuarios = await consultarUsuariosServidor();
      await db.runAsync("BEGIN");

      try {
        await db.runAsync(`DELETE FROM tbusuarios`);  
        if (usuarios.length > 0) {
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
        }

        await db.runAsync("COMMIT");
      } catch (error) {
        await db.runAsync("ROLLBACK");
        throw error;
      }
    } catch (error) {
      throw new Error("Erro ao sincronizar usuários: ", error);
    }
  }

  return {
    consultarUsuarioLocal,
    consultarUsuariosLocal,
    atualizarUsuariosLocal,
  };
}
