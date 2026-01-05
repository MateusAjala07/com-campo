import Cabecalho from "@/components/cabecalho";
import { Plus, WifiSync } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text } from "react-native";
import Button from "@/components/button";
import ModalRegistrarClima from "@/components/modals/registrarClima";
import { useEffect, useState } from "react";
import useRegistrosClimaticosDatabase from "@/database/useRegistrosClimaticosDatabase";
import Lista from "@/components/lista";

export default function RegistrosClimaticos() {
  const [pluviometro, setPluviometro] = useState("");
  const [precipitacao, setPrecipitacao] = useState("");
  const [data, setData] = useState(new Date());
  const [dataFormatada, setDataFormatada] = useState(
    data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  );
  const [guid, setGuid] = useState("");

  const [dataRegistrosClimaticos, setDataRegistrosClimaticos] = useState([]);
  const [isModalRegistrarClimaOpen, setIsModalRegistrarClimaOpen] = useState(false);
  const [acaoModalRegistrarClima, setAcaoModalRegistrarClima] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");

  const { consultarRegistrosClimaticosLocal } = useRegistrosClimaticosDatabase();

  async function carregarDados(pCodCiclo) {
    try {
      setIsLoading(true);
      const response = await consultarRegistrosClimaticosLocal();
      setDataRegistrosClimaticos(response);
    } catch (error) {
      setMensagemErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleIncluir() {
    setAcaoModalRegistrarClima("adicionar");
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

  useEffect(() => {
    if (isModalRegistrarClimaOpen) return;
    carregarDados(1);
  }, [isModalRegistrarClimaOpen]);

  return (
    <>
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
        <Cabecalho atualizar titulo="Registros do Clima" />
        <Lista
          data={dataRegistrosClimaticos}
          loading={isLoading}
          error={mensagemErro}
          emptyMessage=""
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
              onPress={() => handleEditar(item)}
              activeOpacity={0.8}
            >
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">ID: {item.id}</Text>
                {item.sincronizarapp === "N" && <WifiSync color={"#ffdf20"} size={20} />}
              </View>
              <Text className="text-lg font-semibold">Data: {item.data}</Text>
              <Text>Pluviômetro: {item.idpluv}</Text>
              <Text>Precipitação: {item.precipitacao} (mm)</Text>
              <Text>Responsável: {item.nomusuinc}</Text>
            </TouchableOpacity>
          )}
        />
        <SafeAreaView style={{ flex: 1 }}>
          <View className="absolute bottom-6 right-7">
            <Button icon={<Plus color={"#fff"} size={32} />} size="icon" onPress={handleIncluir} />
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </>
  );
}
