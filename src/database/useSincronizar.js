import { redeEServidorAtivo } from "@/utils/funcoes";
import { createMMKV } from "react-native-mmkv";
import useUsuarioDatabase from "./useUsuarioDatabase";
import useFazendaDatabase from "./useFazendaDatabase";

const storage = createMMKV({
  id: "storage",
});

export default function useSincronizar() {
  const { atualizarUsuariosLocal } = useUsuarioDatabase();
  const { atualizarFazendasLocal } = useFazendaDatabase();

  async function sincronizarLogin() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) throw new Error(redeEServidor.mensagem);

      await atualizarUsuariosLocal();
      await atualizarFazendasLocal();

      return { sucesso: true, mensagem: "Sincronização efetuada com sucesso!" };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  return { sincronizarLogin };
}
