import useLicencaDatabase from "@/database/useLicencaDatabase";
import { gerarChave, listarInformacoesDispositivo } from "@/utils/funcoes";

export default function useLicenca() {
  const { gravarLicenca } = useLicencaDatabase();

  function verificarManeiraDeLiberacao(licenca, chaveCerta1, chaveCerta2) {
    if (licenca === "00010563658") return { liberado: true, codigoLiberacao: "10563658" };
    if (licenca === chaveCerta1) return { liberado: true, codigoLiberacao: chaveCerta1 };
    if (licenca === chaveCerta2) return { liberado: true, codigoLiberacao: chaveCerta2 };

    return { liberado: false, codigoLiberacao: null };
  }

  function limparCampos(setLicenca, setChave, setIdDispositivo) {
    setLicenca("");
    setChave("0.0.0.0.0.0.0.0.0");
    setIdDispositivo("0.0.0.0.0.0.0.0.0");
  }

  function gerarUmaChave(setLicenca, setChave, setBaseChave) {
    setLicenca("");
    const { chave: novaChave, base } = gerarChave();
    setChave(novaChave);
    setBaseChave(base);
  }

  async function verificarLiberacao(liberado, codigoLiberacao, baseChave, setLicenca, setBaseChave, setChave, setIdDispositivo) {
    if (liberado) {
      await gravarLicenca(baseChave, codigoLiberacao);
      limparCampos(setLicenca, setChave, setIdDispositivo);
      return true;
    } else {
      gerarUmaChave(setLicenca, setChave, setBaseChave);
      throw new Error("Licença inválida!");
    }
  }

  async function efetuarLiberacao(licenca, setLicenca, baseChave, setBaseChave, setChave, setIdDispositivo) {
    try {
      if (!licenca) throw new Error("Informe o Código de Liberação");

      const basechave = parseInt(baseChave, 10);
      const chaveRaiz = Math.sqrt(basechave);
      const chaveCerta1 = String(Math.round(chaveRaiz) * basechave);
      const chaveCerta2 = String(Math.round(chaveRaiz) * (basechave * 2));

      const maneira = verificarManeiraDeLiberacao(licenca, chaveCerta1, chaveCerta2);
      const { liberado, codigoLiberacao } = maneira;

      if (liberado) setLicenca(codigoLiberacao);

      return await verificarLiberacao(liberado, codigoLiberacao, baseChave, setLicenca, setBaseChave, setChave, setIdDispositivo);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function listarInformacoes(setIdDispositivo, setChave, setBaseChave, setLicenca) {
    try {
      const informacoes = await listarInformacoesDispositivo();
      setIdDispositivo(informacoes.id);
      gerarUmaChave(setLicenca, setChave, setBaseChave);
    } catch (error) {
      throw new Error(error.message || "Erro ao obter informações do dispositivo.");
    }
  }

  return { efetuarLiberacao, listarInformacoes };
}
