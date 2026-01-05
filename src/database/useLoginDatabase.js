import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { consultarParametrosSistema, validarAcesso } from "@/services/api";
import { createMMKV } from "react-native-mmkv";
import useLicencaDatabase from "./useLicencaDatabase";
import { codif } from "./../utils/funcoes";

const storage = createMMKV({
  id: "storage",
});

export default function useLoginDatabase() {
  const db = useSQLiteContext();
  const { verificarLicencaLocal } = useLicencaDatabase();

  async function validarLoginLocal(codusu, senUsu, lembrarLogin, nomUsu) {
    try {
      const usuario = await db.getFirstAsync(
        `
        SELECT acessomobile 
          FROM tbusuarios 
        WHERE codusu = ? 
        AND acessomobile = ?
        `,
        [codusu, "S"],
      );

      if (usuario) {
        const login = await db.getFirstAsync(
          `
          SELECT * 
            FROM tbusuarios 
          WHERE codusu = ? 
          AND senusu = ?
          `,
          [codusu, codif(senUsu)],
        );

        if (login) {
          let sistema = await db.getFirstAsync(`SELECT 1 FROM tbsistema`);

          if (!sistema) {
            sistema = await db.getFirstAsync(
              `
              INSERT INTO tbsistema 
              (codusu,nomusu,senusu,lembrarlogin) 
              VALUES (?,?,?,?)
              `,
              [codusu, nomUsu, senUsu, lembrarLogin ? "S" : "N"],
            );
          } else {
            sistema = await db.getFirstAsync(
              `
              UPDATE tbsistema SET codusu = ?, nomusu = ?, senusu = ?, lembrarlogin = ?
              `,
              [codusu, nomUsu, senUsu, lembrarLogin ? "S" : "N"],
            );
          }

          return "SUCESSO";
        } else {
          return "SENHA INCORRETA";
        }
      } else {
        return "ACESSO NEGADO";
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function efetuarLoginLocal(
    codusu = null,
    nomUsu = "",
    senUsu = "",
    lembrarLogin = false,
    acessomobile = "S",
  ) {
    try {
      if (!codusu) throw new Error("Preencha o código do usuário!");
      if (!senUsu) throw new Error("Preencha a senha!");
      if (!nomUsu) throw new Error("Usuário não encontrado!");

      const usuario = await db.getFirstAsync(
        `
        SELECT 1 FROM tbusuarios 
        WHERE codusu = ? 
        AND acessomobile = ?
        `,
        [codusu, acessomobile],
      );

      if (usuario && Object.keys(usuario).length > 0) {
        const response = await validarLoginLocal(codusu, senUsu, lembrarLogin, nomUsu);

        switch (response) {
          case "SUCESSO":
            storage.set("codUsu", codusu);
            storage.set("nomUsu", nomUsu);
            break;

          case "SENHA INCORRETA":
            throw new Error("Senha incorreta!");

          case "ACESSO NEGADO":
            throw new Error("Acesso negado!");
        }
      } else {
        throw new Error("Usuário não tem permissão para usar o aplicativo!");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function verificarSistemaLocal() {
    try {
      return await db.getFirstAsync(`SELECT * FROM tbsistema`);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function validarAcessoLocal() {
    try {
      const licenca = await verificarLicencaLocal();
      const acesso = await validarAcesso(licenca.imei, licenca.chave, licenca.codacesso);

      switch (acesso) {
        case "ACESSO_NEGADO":
          return { acesso: false, mensagem: "ERRO [000] - Contate o suporte técnico!" };

        case "ACESSO_NEGADO_001":
          return { acesso: false, mensagem: "[001] - Licença não foi liberada no SGC!" };

        case "ACESSO_NEGADO_002":
          return {
            acesso: false,
            mensagem: "ERRO [002] - Usuário não foi liberado no SGC para acessar o App!",
          };

        case "ACESSO_NEGADO_003":
          return {
            acesso: false,
            mensagem: "ERRO [003] - Usuário não é o mesmo definido no aparelho!",
          };

        case "ERRO":
          return { acesso: false, mensagem: "ERRO ao validar acesso ao app!" };

        case "SUCESSO":
          await db.runAsync(
            `
              UPDATE tbsistema SET acessomobile = 'S';            
            `,
          );
          return { acesso: true, mensagem: "Acesso autorizado!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return {
    efetuarLoginLocal,
    verificarSistemaLocal,
    validarAcessoLocal,
  };
}
