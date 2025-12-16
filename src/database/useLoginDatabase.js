import { useSQLiteContext } from "expo-sqlite";
import { router } from "expo-router";
import { consultarParametrosSistema, validarAcesso } from "@/services/api";
import { createMMKV } from "react-native-mmkv";
import useLicencaDatabase from "./useLicencaDatabase";
import { codif } from "./../utils/funcoes";

export default function useLoginDatabase() {
  const storage = createMMKV({
    id: "storage",
  });

  const db = useSQLiteContext();
  const { verificarLicencaLocal } = useLicencaDatabase();

  async function validarLoginLocal(codusu, senUsu, lembrarLogin, nomUsu) {
    try {
      const usuario = await db.getFirstAsync(
        `
        SELECT acessomobile 
          FROM arqusuarios 
        WHERE codusu = ? 
        AND acessomobile = ?
        `,
        [codusu, "S"],
      );

      if (usuario) {
        const login = await db.getFirstAsync(
          `
          SELECT * 
            FROM arqusuarios 
          WHERE codusu = ? 
          AND senusu = ?
          `,
          [codusu, codif(senUsu)],
        );

        if (login) {
          let sistema = await db.getFirstAsync(`SELECT 1 FROM sistema`);

          if (!sistema) {
            sistema = await db.getFirstAsync(
              `
              INSERT INTO SISTEMA 
              (codusu,nomusu,senusu,lembrarlogin) 
              VALUES (?,?,?,?)
              `,
              [codusu, nomUsu, senUsu, lembrarLogin ? "S" : "N"],
            );
          } else {
            sistema = await db.getFirstAsync(
              `
              UPDATE SISTEMA SET codusu = ?, nomusu = ?, senusu = ?, lembrarlogin = ?
              `,
              [codusu, nomUsu, senUsu, lembrarLogin ? "S" : "N"],
            );
          }

          return "SUCESSO";
        } else {
          return "USUÁRIO NÃO ENCONTRADO";
        }
      } else {
        return "ACESSO NEGADO";
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function atualizarModuloSistemaLocal() {
    try {
      const sistema = await consultarParametrosSistema();
      const gradeOrcamento = sistema.gradeorcamento;
      storage.set("gradeOrcamento", gradeOrcamento);

      const response = await db.getFirstAsync(`SELECT gradeorcamento FROM sistema`);
      if (response && response.length > 0) {
        await db.runAsync(`UPDATE sistema SET gradeorcamento = ?`, [gradeOrcamento]);
      } else {
        await db.runAsync(`INSERT INTO sistema (gradeorcamento) VALUES (?)`, [gradeOrcamento]);
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
      if (!codusu || !senUsu || !nomUsu) throw new Error("Preencha todos os campos!");

      const usuario = await db.getFirstAsync(
        `
        SELECT 1 FROM arqusuarios 
        WHERE codusu = ? 
        AND acessomobile = ?
        `,
        [codusu, acessomobile],
      );

      if (Object.keys(usuario).length > 0) {
        const response = await validarLoginLocal(codusu, senUsu, lembrarLogin, nomUsu);

        switch (response) {
          case "SUCESSO":
            storage.set("codUsu", codusu);
            router.replace("/inicio");
            break;

          case "USUÁRIO NÃO ENCONTRADO":
            throw new Error("Usuário não encontrado!");

          case "ACESSO NEGADO":
            throw new Error("Acesso negado!");
        }
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function verificarSistemaLocal() {
    try {
      return await db.getFirstAsync(`SELECT * FROM SISTEMA`);
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
          return { acesso: true, mensagem: "Acesso autorizado!" };
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return {
    efetuarLoginLocal,
    atualizarModuloSistemaLocal,
    verificarSistemaLocal,
    validarAcessoLocal,
  };
}
