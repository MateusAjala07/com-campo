import Cabecalho from "@/components/cabecalho";
import Lista from "@/components/lista";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { RefreshCcw } from "lucide-react-native";
import Button from "@/components/button";
import { redeEServidorAtivo } from "@/utils/funcoes";
import useSafrasDatabase from "@/database/useSafrasDatabase";
import useFazendaDatabase from "@/database/useFazendaDatabase";
import useRegistrosClimaticosDatabase from "@/database/useRegistrosClimaticosDatabase";

export default function Sincronismo() {
  const data = [
    { nome: "Fazendas", isLoading: false },
    { nome: "Centro de Custos", isLoading: false },
    { nome: "Ciclo de Produção", isLoading: false },
    { nome: "Lotes", isLoading: false },
    { nome: "Safras", isLoading: false },
    { nome: "Mercadorias", isLoading: false },
    { nome: "Depositos", isLoading: false },
    { nome: "Tipo Ocorrência", isLoading: false },
    { nome: "Pluviômetros", isLoading: false },
  ];

  const { atualizarSafrasLocal } = useSafrasDatabase();
  const { atualizarFazendasLocal } = useFazendaDatabase();
  const { atualizarPluviometrosLocal } = useRegistrosClimaticosDatabase();

  async function handleSincronizar(item) {
    switch (item) {
      case "Fazendas":
        await sincronizarFazendas();
        break;
      case "Centro de Custos":
        break;
      case "Ciclo de Produção":
        break;
      case "Lotes":
        break;
      case "Safras":
        await sincronizarSafras();
        break;
      case "Mercadorias":
        break;
      case "Depositos":
        break;
      case "Tipo Ocorrência":
        break;
      case "Pluviômetros":
        sincronizarPluviometros();
        break;

      default:
        break;
    }
  }

  async function sincronizarFazendas() {
    try {
      await atualizarFazendasLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  async function sincronizarSafras() {
    try {
      data[4].isLoading = true;
      await atualizarSafrasLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    } finally {
      data[4].isLoading = false;
    }
  }

  async function sincronizarPluviometros() {
    try {
      await atualizarPluviometrosLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      <Cabecalho titulo="Sincronizar" atualizar icon={<RefreshCcw />} />
      <Lista
        data={data}
        loading={false}
        error={""}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
            onPress={() => handleSincronizar(item.nome)}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg">{item.nome}</Text>
              <Button
                icon={<RefreshCcw />}
                size="icon"
                variant="secondary"
                onPress={() => handleSincronizar(item.nome)}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
