import { redeEServidorAtivo } from "@/utils/funcoes";
import { createMMKV } from "react-native-mmkv";
import useLoginDatabase from "./useLoginDatabase";
import useUsuarioDatabase from "./useUsuarioDatabase";

export default function useSincronizar() {
  const storage = createMMKV({
    id: "storage",
  });

  const { atualizarUsuariosLocal } = useUsuarioDatabase();
  const { atualizarModuloSistemaLocal } = useLoginDatabase();

  async function sincronizarLogin() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) return;

      if (
        !storage.getString("ipConexao") ||
        !storage.getString("portaConexao") ||
        !storage.getString("descricaoConexao")
      ) {
        throw new Error("Nenhum conexão ativa!");
      }

      await atualizarUsuariosLocal();
      await atualizarModuloSistemaLocal();

      return { sucesso: true, mensagem: "Sincronização efetuada com sucesso!" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { sincronizarLogin };
}
