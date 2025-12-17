import { Text, Modal, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Cabecalho from "@/components/cabecalho";
import useUsuarioDatabase from "@/database/useUsuarioDatabase";
import Lista from "../lista";

export default function ModalUsuarios({ isOpen, setIsOpen, handleUsuario = () => {} }) {
  const { consultarUsuariosLocal } = useUsuarioDatabase();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  async function listarUsuarios() {
    try {
      setLoading(true);
      const response = await consultarUsuariosLocal();
      setData(response);
    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) listarUsuarios();
  }, [isOpen]);

  return (
    <Modal visible={isOpen}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
        <Cabecalho titulo="Usuários" voltar={() => setIsOpen(false)} />
        <SafeAreaView style={{ flex: 1, padding: 16 }}>
          <Lista
            data={data}
            loading={loading}
            error={error}
            keyExtractor={(item) => item.codusu}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
                onPress={() => handleUsuario(item)}
                activeOpacity={0.8}
              >
                <Text className="text-gray-500">{item.codusu}</Text>
                <Text className="text-lg font-semibold">{item.nomusu}</Text>
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
}
