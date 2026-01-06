import Cabecalho from "@/components/cabecalho";
import { Plus, WifiSync } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text, Alert } from "react-native";
import Button from "@/components/button";
import ModalRegistrarClima from "@/components/modals/registrarClima";
import { useEffect, useState } from "react";
import useRegistrosClimaticosDatabase from "@/database/useRegistrosClimaticosDatabase";
import Lista from "@/components/lista";
import { asyncAlert } from "@/components/alerta";
import { redeEServidorAtivo } from "@/utils/funcoes";
import { createMMKV } from "react-native-mmkv";
import Loading from "@/components/loading";

const storage = createMMKV({
  id: "storage",
});

export default function RegistrosClimaticos() {
  const insets = useSafeAreaInsets();

  const [pluviometro, setPluviometro] = useState("");
  const [precipitacao, setPrecipitacao] = useState("");
  const [data, setData] = useState(new Date());
  const [dataFormatada, setDataFormatada] = useState(data.toLocaleDateString("pt-BR"));
  const [guid, setGuid] = useState("");

  const [dataRegistrosClimaticos, setDataRegistrosClimaticos] = useState([]);
  const [isModalRegistrarClimaOpen, setIsModalRegistrarClimaOpen] = useState(false);
  const [acaoModalRegistrarClima, setAcaoModalRegistrarClima] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSincronizar, setIsLoadingSincronizar] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const {
    consultarRegistrosClimaticosLocal,
    excluirRegistrosClimaticosLocal,
    uploadRegistrosClimaticos,
    downloadRegistrosClimaticos,
  } = useRegistrosClimaticosDatabase();

  async function carregarDadosLocais() {
    try {
      setIsLoading(true);
      const response = await consultarRegistrosClimaticosLocal();
      setDataRegistrosClimaticos(response);
    } catch (error) {
      setMensagemErro("Erro ao carregar local: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function sincronizarDados() {
    try {
      const conexao = await redeEServidorAtivo();

      if (conexao.ativo) {
        setIsLoadingSincronizar(true);

        await uploadRegistrosClimaticos();

        await downloadRegistrosClimaticos();

        await carregarDadosLocais();
      }
    } catch (error) {
      setMensagemErro("Falha na sincronização");
    } finally {
      setIsLoadingSincronizar(false);
    }
  }

  function handleIncluir() {
    setAcaoModalRegistrarClima("adicionar");
    setPluviometro("");
    setPrecipitacao("");
    setDataFormatada(data.toLocaleDateString("pt-BR"));
    setIsModalRegistrarClimaOpen(true);
  }

  function handleEditar(item) {
    setAcaoModalRegistrarClima("editar");
    setPluviometro(String(item?.idpluv));
    setPrecipitacao(String(item?.precipitacao));
    setDataFormatada(item?.data);
    setGuid(item?.guid);
    setIsModalRegistrarClimaOpen(true);
  }

  async function handleExcluir(pGuid) {
    try {
      const confirmar = await asyncAlert({
        title: "Atenção",
        message: "Deseja realmente excluir o registro selecionado?",
        textYes: "Sim",
        textNo: "Não",
      });

      if (confirmar) {
        await excluirRegistrosClimaticosLocal(pGuid);

        await carregarDadosLocais();

        sincronizarDados();
      }
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  useEffect(() => {
    if (isModalRegistrarClimaOpen) return;

    storage.set("numCompeso", 1);

    carregarDadosLocais().then(() => {
      sincronizarDados();
    });
  }, [isModalRegistrarClimaOpen]);

  return (
    <>
      <Loading ativo={isLoadingSincronizar} mensagem={"Sincronizando..."} />
      <ModalRegistrarClima
        isOpen={isModalRegistrarClimaOpen}
        setIsOpen={setIsModalRegistrarClimaOpen}
        pluviometro={pluviometro}
        setPluviometro={setPluviometro}
        precipitacao={precipitacao}
        setPrecipitacao={setPrecipitacao}
        data={data}
        setData={setData}
        dataFormatada={dataFormatada}
        setDataFormatada={setDataFormatada}
        guidRegistro={guid}
        acao={acaoModalRegistrarClima}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
        <Cabecalho atualizar={sincronizarDados} titulo="Registros do Clima" />

        <Lista
          data={dataRegistrosClimaticos}
          loading={isLoading}
          error={mensagemErro}
          emptyMessage="Nenhum registro encontrado."
          keyExtractor={(item) => item.guid}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
              onPress={() => handleEditar(item)}
              onLongPress={() => handleExcluir(item.guid)}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">ID: {item.id ? item.id : "..."}</Text>
                {item.sincronizarapp === "N" && <WifiSync color={"#ffdf20"} size={20} />}
              </View>
              <Text className="text-lg font-semibold">Data: {item.data}</Text>
              <Text>Pluviômetro: {item.idpluv}</Text>
              <Text>Precipitação: {item.precipitacao} (mm)</Text>
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
