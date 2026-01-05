import { Text, Modal, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Cabecalho from "@/components/cabecalho";
import useUsuarioDatabase from "@/database/useUsuarioDatabase";
import Lista from "../lista";

export default function ModalUsuarios({ isOpen, setIsOpen, handleUsuario = () => {} }) {
  const { consultarUsuariosLocal } = useUsuarioDatabase();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mensagemErro, setMensagemErro] = useState("");

  async function listarUsuarios() {
    try {
      setIsLoading(true);
      const response = await consultarUsuariosLocal();
      setData(response);
    } catch (error) {
      setMensagemErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (isOpen) listarUsuarios();
  }, [isOpen]);

  return (
    <Modal visible={isOpen}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
        <Cabecalho titulo="Usuários" voltar={() => setIsOpen(false)} />
        <SafeAreaView style={{ flex: 1 }}>
          <Lista
            data={data}
            loading={isLoading}
            error={mensagemErro}
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
