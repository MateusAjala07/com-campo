import Button from "@/components/button";
import Cabecalho from "@/components/cabecalho";
import Lista from "@/components/lista";
import ModalRegistrarSaidasEstoque from "@/components/modals/registrarSaidasEstoque";
import { consultarLancamentosBaixasServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { Clock, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function RegistrosBaixaDeEstoque() {
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [dataBaixas, setDataBaixas] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");

  const [isModalRegistrarSaidasEstoqueOpen, setIsModalRegistrarSaidasEstoqueOpen] = useState(false);

  async function carregarDadosLocais() {
    try {
      setIsLoading(true);
      const response = await consultarLancamentosBaixasServidor();
      setDataBaixas(response);
    } catch (error) {
      setMensagemErro("Erro ao carregar local: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function sincronizarDados() {
    try {
      const conexao = await redeEServidorAtivo();
    } catch (error) {
      setMensagemErro("Falha na sincronização");
    }
  }

  async function handleIncluir() {
    setIsModalRegistrarSaidasEstoqueOpen(true);
  }

  useEffect(() => {
    carregarDadosLocais().then(() => {
      sincronizarDados();
    });
  }, []);

  return (
    <>
      <ModalRegistrarSaidasEstoque
        isOpen={isModalRegistrarSaidasEstoqueOpen}
        setIsOpen={setIsModalRegistrarSaidasEstoqueOpen}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
        <Cabecalho atualizar={sincronizarDados} titulo="Registros de Baixa de Estoque" />
        <Lista
          data={dataBaixas}
          loading={isLoading}
          error={mensagemErro}
          emptyMessage="Nenhum registro encontrado."
          keyExtractor={(item) => item.guid}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
              // onPress={() => handleEditar(item)}
              // onLongPress={() => handleExcluir(item.guid)}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">ID: {item.id ? item.id : "..."}</Text>
                {item.sincronizarapp === "N" && <Clock color={"#ffdf20"} size={20} />}
              </View>
              {/* <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">
                  {item.id ? item.id : "..."} - {item.nomusuinc}
                </Text>
                <View className="flex-row gap-2">
                  <Text className="text-gray-500">{item.datlan}</Text>
                  {item.sincronizarapp === "N" && <Clock color={"#ffdf20"} size={20} />}
                </View>
              </View> */}
              <Text className="text-lg font-semibold">
                Data: {item.datlan} - {item.horlan}
              </Text>
              <Text>{item.nompro}</Text>
              <Text>Quantidade: {item.qtdpro}</Text>
              <Text>Funcionário: {item.nomfun}</Text>
              <Text>Vei./Máq: {item.nombem}</Text>
              <Text>Responsável: {item.nomusuinc}</Text>
            </TouchableOpacity>
          )}
        />

        <View
          style={{
            position: "absolute",
            right: 24,
            bottom: insets.bottom + 24,
          }}
        >
          <Button icon={<Plus color={"#fff"} size={32} />} size="icon" onPress={handleIncluir} />
        </View>
      </SafeAreaView>
    </>
  );
}
