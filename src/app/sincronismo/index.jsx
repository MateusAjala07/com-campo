import React, { use, useEffect, useState } from "react";
import Cabecalho from "@/components/cabecalho";
import Lista from "@/components/lista";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, Text, View, Alert, ActivityIndicator } from "react-native";
import { RefreshCcw } from "lucide-react-native";
import Button from "@/components/button";
import useSafrasDatabase from "@/database/useSafrasDatabase";
import useFazendaDatabase from "@/database/useFazendaDatabase";
import useClimaticoDatabase from "@/database/useClimaticoDatabase";
import useCentroDeCustoDatabase from "@/database/useCentroDeCustoDatabase";
import useCicloDeProducaoDatabase from "@/database/useCicloDeProducaoDatabase";
import useLoteDatabase from "@/database/useLoteDatabase";
import useTipoOcorrenciaDatabase from "@/database/useTipoOcorrenciaDatabase";
import useFuncionarioDatabase from "@/database/useFuncionarioDatabase";
import useMercadoriaDatabase from "@/database/useMercadoriaDatabase";
import useDepositoDatabase from "@/database/useDepositoDatabase";
import useOcorrenciaDatabase from "@/database/useOcorrenciaDatabase";
import useLancamentoBaixaDatabase from "@/database/useLancamentoBaixaDatabase";
import { useNavigation } from "expo-router";

export default function Sincronismo() {
  const navigation = useNavigation();
  const [items, setItems] = useState([
    { nome: "Fazendas", isLoading: false },
    { nome: "Centro de Custos", isLoading: false },
    { nome: "Ciclo de Produção", isLoading: false },
    { nome: "Lotes", isLoading: false },
    { nome: "Safras", isLoading: false },
    { nome: "Mercadorias", isLoading: false },
    { nome: "Depósitos", isLoading: false },
    { nome: "Tipo Ocorrência", isLoading: false },
    { nome: "Pluviômetros", isLoading: false },
    { nome: "Funcionários", isLoading: false },
    { nome: "Lançamento Ocorrências", isLoading: false },
    { nome: "Lançamento Baixas", isLoading: false },
    { nome: "Lançamento Climático", isLoading: false },
  ]);
  useEffect(() => {
    const valor = items.some((n) => n.isLoading === true);
    const sairTela = navigation.addListener("beforeRemove", (e) => {
      if (!valor) {
        return;
      }
      e.preventDefault();
      Alert.alert("Você não pode sair!", "Sincronização em andamento", [
        { text: "Ok", style: "cancel", onPress: () => {} },
        //  {
        //     text: 'Sair',
        //     style: 'destructive',
        //     // Se o usuário confirmar, navega manualmente
        //     onPress: () => navigation.dispatch(e.data.action),
        //   },
      ]);
    });
    return sairTela;
  }, [navigation, items]);

  const { atualizarFazendasLocal } = useFazendaDatabase();
  const { atualizarCentroDeCustosLocal } = useCentroDeCustoDatabase();
  const { atualizarSafrasLocal } = useSafrasDatabase();
  const { atualizarPluviometrosLocal, uploadRegistrosClimaticos, downloadRegistrosClimaticos } =
    useClimaticoDatabase();
  const { atualizarCicloDeProducaoLocal } = useCicloDeProducaoDatabase();
  const { atualizarLotesLocal } = useLoteDatabase();
  const { atualizarTipoOcorrenciasLocal } = useTipoOcorrenciaDatabase();
  const { atualizarFuncionariosLocal } = useFuncionarioDatabase();
  const { atualizarMercadoriasLocal } = useMercadoriaDatabase();
  const { atualizarDepositosLocal } = useDepositoDatabase();
  const { atualizarOcorrenciasLocal } = useOcorrenciaDatabase();
  const { atualizarLancamentosBaixasLocal } = useLancamentoBaixaDatabase();

  const setLoading = (nomeItem, status) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.nome === nomeItem ? { ...item, isLoading: status } : item)),
    );
  };

  async function handleSincronizar(nomeItem) {
    try {
      switch (nomeItem) {
        case "Fazendas":
          await sincronizarFazendas();
          Alert.alert("Sincronizado com Sucesso", "Fazenda sincronizada com sucesso!");
          break;
        case "Centro de Custos":
          await sincronizarCentroDeCustos();
          Alert.alert("Sincronizado com Sucesso", "Centro de Custos sincronizado com sucesso!");
          break;
        case "Ciclo de Produção":
          await sincronizarCicloDeProducao();
          Alert.alert("Sincronizado com Sucesso","Ciclo de Produção sincronizado com sucesso!");
          break;
        case "Lotes":
          await sincronizarLotes();
          Alert.alert("Sincronizado com Sucesso","Lotes sincronizado com sucesso!");
          break;
        case "Safras":
          await sincronizarSafras();
          Alert.alert("Sincronizado com Sucesso","Safras sincronizada com sucesso!");
          break;
        case "Mercadorias":
          await sincronizarMercadorias();
          Alert.alert("Sincronizado com Sucesso","Mercadorias sincronizada com sucesso!");
          break;
        case "Depósitos":
          await sincronizarDepositos();
          Alert.alert("Sincronizado com Sucesso","Depósitos sincronizados com sucesso!");
          break;
        case "Tipo Ocorrência":
          await sincronizarTipoOcorrencia();
          Alert.alert("Sincronizado com Sucesso","Tipo Ocorrência sincronizado com sucesso!");
          break;
        case "Pluviômetros":
          await sincronizarPluviometros();
          Alert.alert("Sincronizado com Sucesso","Pluviômetros sincronizados com sucesso!");
          break;
        case "Funcionários":
          await sincronizarFuncionarios();
          Alert.alert("Sincronizado com Sucesso","Funcionários sincronizados com sucesso!");
          break;
        case "Lançamento Ocorrências":
          await sincronizarOcorrencias();
          Alert.alert("Sincronizado com Sucesso","Lançamentos sincronizado com sucesso!");
          break;
        case "Lançamento Baixas":
          await sincronizarLancamentosBaixas();
          Alert.alert("Sincronizado com Sucesso","Lançamentos Baixas sincronizado com sucesso!");
          break;
        case "Lançamento Climático":
          await sincronizarClimaticos();
          Alert.alert("Sincronizado com Sucesso","Lançametnos Cliamáticos sincronizado com sucesso!");
          break;
        case "Todos":
          await sincronizarFazendas();
          await sincronizarCentroDeCustos();
          await sincronizarCicloDeProducao();
          await sincronizarLotes();
          await sincronizarSafras();
          await sincronizarMercadorias();
          await sincronizarDepositos();
          await sincronizarTipoOcorrencia();
          await sincronizarPluviometros();
          await sincronizarFuncionarios();
          await sincronizarOcorrencias();
          await sincronizarLancamentosBaixas();
          await sincronizarClimaticos();
          Alert.alert("Sincronizados com Sucesso","Dados sincronizados com sucesso!");
          break;
        default:
          break;
      }
    } catch (error) {
      Alert.alert("ERRO", error.message);
    }
  }

  async function sincronizarFazendas() {
    try {
      setLoading("Fazendas", true);
      await atualizarFazendasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Fazendas", false);
    }
  }

  async function sincronizarCentroDeCustos() {
    try {
      setLoading("Centro de Custos", true);
      await atualizarCentroDeCustosLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Centro de Custos", false);
    }
  }

  async function sincronizarCicloDeProducao() {
    try {
      setLoading("Ciclo de Produção", true);
      await atualizarCicloDeProducaoLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Ciclo de Produção", false);
    }
  }

  async function sincronizarLotes() {
    try {
      setLoading("Lotes", true);
      await atualizarLotesLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Lotes", false);
    }
  }

  async function sincronizarSafras() {
    try {
      setLoading("Safras", true);
      await atualizarSafrasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Safras", false);
    }
  }

  async function sincronizarMercadorias() {
    try {
      setLoading("Mercadorias", true);
      await atualizarMercadoriasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Mercadorias", false);
    }
  }

  async function sincronizarDepositos() {
    try {
      setLoading("Depósitos", true);
      await atualizarDepositosLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Depósitos", false);
    }
  }

  async function sincronizarTipoOcorrencia() {
    try {
      setLoading("Tipo Ocorrência", true);
      await atualizarTipoOcorrenciasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Tipo Ocorrência", false);
    }
  }

  async function sincronizarPluviometros() {
    try {
      setLoading("Pluviômetros", true);
      await atualizarPluviometrosLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Pluviômetros", false);
    }
  }

  async function sincronizarFuncionarios() {
    try {
      setLoading("Funcionários", true);
      await atualizarFuncionariosLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Funcionários", false);
    }
  }

  async function sincronizarOcorrencias() {
    try {
      setLoading("Lançamento Ocorrências", true);
      await atualizarOcorrenciasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Lançamento Ocorrências", false);
    }
  }

  async function sincronizarLancamentosBaixas() {
    try {
      setLoading("Lançamento Baixas", true);
      await atualizarLancamentosBaixasLocal();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Lançamento Baixas", false);
    }
  }

  async function sincronizarClimaticos() {
    try {
      setLoading("Lançamento Climático", true);
      await uploadRegistrosClimaticos();
      await downloadRegistrosClimaticos();
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setLoading("Lançamento Climático", false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
      <Cabecalho
        titulo="Sincronizar"
        atualizar={() => handleSincronizar("Todos")}
        icon={<RefreshCcw />}
      />
      <Lista
        data={items}
        loading={false}
        error={""}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
            onPress={() => handleSincronizar(item.nome)}
            activeOpacity={0.8}
            disabled={item.isLoading}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-lg">{item.nome}</Text>
              <Button
                icon={
                  item.isLoading ? (
                    <ActivityIndicator size="small" color="#333" />
                  ) : (
                    <RefreshCcw color="#333" size={20} />
                  )
                }
                size="icon"
                variant="secondary"
                onPress={() => handleSincronizar(item.nome)}
                disabled={item.isLoading}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
