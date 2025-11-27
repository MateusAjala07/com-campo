import { View, Text, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../input";
import Button from "../button";
import { useEffect, useState } from "react";
import useLicenca from "../../hook/useLicenca";

export default function ModalLicenca({ isOpen, setIsOpen }) {
  const [codigoLiberacao, setCodigoLiberacao] = useState("");
  const [chave, setChave] = useState("0.0.0.0.0.0.0.0.0");
  const [idDispositivo, setIdDispositivo] = useState("0.0.0.0.0.0.0.0.0");
  const [baseChave, setBaseChave] = useState("");

  const { efetuarLiberacao, listarInformacoes } = useLicenca();

  async function handleLiberar() {
    try {
      await efetuarLiberacao(
        codigoLiberacao,
        setCodigoLiberacao,
        baseChave,
        setBaseChave,
        setChave,
        setIdDispositivo,
      );
      Alert.alert("Sucesso", "Licença liberada com sucesso!");
      setIsOpen(false);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  useEffect(() => {
    if (isOpen) {
      listarInformacoes(setIdDispositivo, setChave, setBaseChave, setCodigoLiberacao);
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setIsOpen(false)}
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          paddingHorizontal: 16,
          justifyContent: "center",
        }}
      >
        <View className="bg-white p-5 rounded-xl gap-y-4 shadow">
          <View>
            <Text>Chave: {chave}</Text>
            <Text>ID Dispositivo: {idDispositivo}</Text>
          </View>

          <Input
            label="Licença"
            placeholder="Insira o código de liberação"
            value={codigoLiberacao}
            onChangeText={setCodigoLiberacao}
          />

          <Button texto="Liberar" onPress={handleLiberar} />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
