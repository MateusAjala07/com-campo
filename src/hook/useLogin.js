import useLicencaDatabase from "@/database/useLicencaDatabase";
import useLoginDatabase from "@/database/useLoginDatabase";
import { createMMKV } from "react-native-mmkv";

export default function useLogin() {
  const storage = createMMKV({
    id: "storage",
  });

  const { verificarLicenca } = useLicencaDatabase();
  const loginDatabase = useLoginDatabase();

  async function validarLicenca(setShowModalLicenca) {
    try {
      const licenca = await verificarLicenca();
      if (!licenca) {
        setShowModalLicenca(true);
        return;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function verificarPrimeiroAcesso() {
    try {
      const sistema = await loginDatabase.verificarSistema();
      return !sistema
        ? { primeiroAcesso: true, sistema: null }
        : { primeiroAcesso: false, sistema };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  function verificarConexaoGravada(setShowModalConexao) {
    if (
      !storage.getString("descricaoConexao") ||
      !storage.getString("ipConexao") ||
      !storage.getString("portaConexao")
    ) {
      setShowModalConexao(true);
      return false;
    }
    return true;
  }

  function carregarCampos(
    codusu,
    nomusu,
    senusu,
    setCodigo,
    setUsuario,
    setSenha,
    lembrarLogin,
    setLembrarLogin,
  ) {
    setCodigo(lembrarLogin === "S" ? String(codusu) : "");
    setUsuario(lembrarLogin === "S" ? nomusu : "");
    setSenha(lembrarLogin === "S" ? senusu : "");
    setLembrarLogin(lembrarLogin === "S" ? true : false);
  }

  async function inicializarLogin(
    setShowModalLicenca,
    setShowModalConexao,
    setPrimeiroAcesso,
    setCodigo,
    setUsuario,
    setSenha,
    lembrarLogin,
    setLembrarLogin,
  ) {
    try {
      if (!(await validarLicenca(setShowModalLicenca))) return;

      if (!verificarConexaoGravada(setShowModalConexao)) return;

      const acesso = await verificarPrimeiroAcesso();
      setPrimeiroAcesso(acesso.primeiroAcesso);
      if (acesso.primeiroAcesso) return;

      const { codusu, nomusu, senusu } = acesso.sistema;
      carregarCampos(
        codusu,
        nomusu,
        senusu,
        setCodigo,
        setUsuario,
        setSenha,
        lembrarLogin,
        setLembrarLogin,
      );
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function efetuarLogin(codigo, usuario, senha, lembrarLogin) {
    try {
      console.log({ codigo, usuario, senha, lembrarLogin });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { inicializarLogin, efetuarLogin };
}
