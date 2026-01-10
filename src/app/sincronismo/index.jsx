import React, { useState } from "react";
import Cabecalho from "@/components/cabecalho";
import Lista from "@/components/lista";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity, Text, View, Alert, ActivityIndicator } from "react-native";
import { RefreshCcw } from "lucide-react-native";
import Button from "@/components/button";
import useSafrasDatabase from "@/database/useSafrasDatabase";
import useFazendaDatabase from "@/database/useFazendaDatabase";
import useRegistrosClimaticosDatabase from "@/database/useRegistrosClimaticosDatabase";
import { redeEServidorAtivo } from "@/utils/funcoes";

export default function Sincronismo() {
  const [items, setItems] = useState([
    { nome: "Fazendas", isLoading: false },
    { nome: "Centro de Custos", isLoading: false },
    { nome: "Ciclo de Produção", isLoading: false },
    { nome: "Lotes", isLoading: false },
    { nome: "Safras", isLoading: false },
    { nome: "Mercadorias", isLoading: false },
    { nome: "Depositos", isLoading: false },
    { nome: "Tipo Ocorrência", isLoading: false },
    { nome: "Pluviômetros", isLoading: false },
  ]);

  const { atualizarSafrasLocal } = useSafrasDatabase();
  const { atualizarFazendasLocal } = useFazendaDatabase();
  const { atualizarPluviometrosLocal } = useRegistrosClimaticosDatabase();

  const setLoading = (nomeItem, status) => {
    setItems((prevItems) =>
      prevItems.map((item) => (item.nome === nomeItem ? { ...item, isLoading: status } : item)),
    );
  };

  async function handleSincronizar(nomeItem) {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (!redeEServidor.ativo) {
        throw new Error(redeEServidor.mensagem);
      }

      switch (nomeItem) {
        case "Fazendas":
          await sincronizarFazendas();
          break;
        case "Safras":
          await sincronizarSafras();
          break;
        case "Pluviômetros":
          await sincronizarPluviometros();
          break;
        case "Todos":
          await sincronizarFazendas();
          await sincronizarSafras();
          await sincronizarPluviometros();
          break;
        default:
          break;
      }
    } catch (error) {
      Alert.alert("ERRO", error.message)
    }
  }

  async function sincronizarFazendas() {
    try {
      setLoading("Fazendas", true);
      await atualizarFazendasLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    } finally {
      setLoading("Fazendas", false);
    }
  }

  async function sincronizarSafras() {
    try {
      setLoading("Safras", true);
      await atualizarSafrasLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    } finally {
      setLoading("Safras", false);
    }
  }

  async function sincronizarPluviometros() {
    try {
      setLoading("Pluviômetros", true);
      await atualizarPluviometrosLocal();
    } catch (error) {
      Alert.alert("ERRO", error.message);
    } finally {
      setLoading("Pluviômetros", false);
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
