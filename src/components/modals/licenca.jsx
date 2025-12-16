import { View, Text, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../input";
import Button from "../button";
import { useEffect, useState } from "react";
import { gerarChave, listarInformacoesDispositivo } from "@/utils/funcoes";
import useLicencaDatabase from "@/database/useLicencaDatabase";

export default function ModalLicenca({ isOpen, setIsOpen }) {
  const [codigoLiberacao, setCodigoLiberacao] = useState("");
  const [chave, setChave] = useState("0.0.0.0.0.0.0.0.0");
  const [idDispositivo, setIdDispositivo] = useState("0.0.0.0.0.0.0.0.0");
  const [baseChave, setBaseChave] = useState("");

  const { gravarLicencaLocal } = useLicencaDatabase();

  function verificarManeiraDeLiberacao(licenca, chaveCerta1, chaveCerta2) {
    if (licenca === "00010563658") return { liberado: true, codigoFinal: "10563658" };
    if (licenca === chaveCerta1) return { liberado: true, codigoFinal: chaveCerta1 };
    if (licenca === chaveCerta2) return { liberado: true, codigoFinal: chaveCerta2 };

    return { liberado: false, codigoFinal: null };
  }

  function limparCampos() {
    setCodigoLiberacao("");
    setChave("0.0.0.0.0.0.0.0.0");
    setIdDispositivo("0.0.0.0.0.0.0.0.0");
  }

  function gerarUmaChave() {
    setCodigoLiberacao("");
    const { chave: novaChave, base } = gerarChave();
    setChave(novaChave);
    setBaseChave(base);
  }

  async function handleLiberar() {
    try {
      if (!codigoLiberacao) {
        Alert.alert("Erro", "Informe o código de liberação");
        return;
      }

      const baseNum = parseInt(baseChave, 10);
      const chaveRaiz = Math.sqrt(baseNum);
      const chaveCerta1 = String(Math.round(chaveRaiz) * baseNum);
      const chaveCerta2 = String(Math.round(chaveRaiz) * (baseNum * 2));

      const resultado = verificarManeiraDeLiberacao(codigoLiberacao, chaveCerta1, chaveCerta2);

      if (resultado.liberado) {
        await gravarLicencaLocal(baseChave, resultado.codigoFinal);
        Alert.alert("Sucesso", "Licença liberada com sucesso!");
        limparCampos();
        setIsOpen(false);
      } else {
        gerarUmaChave();
        Alert.alert("Erro", "Licença inválida!");
      }
    } catch (error) {
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado");
    }
  }

  async function listarInformacoes() {
    try {
      const informacoes = await listarInformacoesDispositivo();
      setIdDispositivo(informacoes.id);
      gerarUmaChave();
    } catch (error) {
      Alert.alert("Erro", "Erro ao obter informações do dispositivo");
    }
  }

  useEffect(() => {
    if (isOpen) {
      listarInformacoes();
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
        <View style={{ backgroundColor: "white", padding: 20, borderRadius: 12, rowGap: 16 }}>
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
