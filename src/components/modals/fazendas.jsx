import { Modal, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Cabecalho from "../cabecalho";
import Lista from "../lista";
import { useEffect, useState } from "react";
import useFazendaDatabase from "@/database/useFazendaDatabase";
import { createMMKV } from "react-native-mmkv";

const storage = createMMKV({
  id: "storage",
});

export default function ModalFazendas({ isOpen, setIsOpen, handleFazenda = () => {} }) {
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [data, setData] = useState([]);

  const { consultarFazendasLocal } = useFazendaDatabase();

  async function listarFazendas() {
    try {
      setIsLoading(true);
      const response = await consultarFazendasLocal();
      setData(response);
    } catch (error) {
      setMensagemErro(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    storage.set("numCompeso", 0);
    storage.set("nomFazenda", "");
    storage.set("codCiclo", 0);
    listarFazendas();
  }, []);

  return (
    <>
      <Modal visible={isOpen}>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8" }}>
          <Cabecalho titulo="Fazendas" voltar={() => setIsOpen(false)} />
          <SafeAreaView style={{ flex: 1 }}>
            <Lista
              data={data}
              loading={isLoading}
              error={mensagemErro}
              emptyMessage="Nenhuma fazenda encontrada"
              keyExtractor={(item) => item.numcompeso}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 mb-2 bg-white rounded-2xl shadow-sm"
                  onPress={() => handleFazenda(item)}
                  activeOpacity={0.8}
                >
                  <Text className="text-lg font-semibold">{item.nomfazenda}</Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </SafeAreaView>
      </Modal>
    </>
  );
}
