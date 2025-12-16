import { View, Alert, Modal } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/input";
import Button from "@/components/button";
import { createMMKV } from "react-native-mmkv";
import useLoginDatabase from "@/database/useLoginDatabase";
import useLicencaDatabase from "@/database/useLicencaDatabase";
import { api, gravarLicenca } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";

export default function ModalConexao({ isOpen, setIsOpen }) {
  const storage = createMMKV({ id: "storage" });

  const [descricao, setDescricao] = useState(storage.getString("descricaoConexao") || "");
  const [ip, setIp] = useState(storage.getString("ipConexao") || "");
  const [porta, setPorta] = useState(storage.getString("portaConexao") || "");

  const { validarAcessoLocal } = useLoginDatabase();
  const { verificarLicencaLocal } = useLicencaDatabase();

  function validarDados() {
    if (!descricao) throw Alert.alert("Erro", "Descrição não informada");
    if (!ip) throw Alert.alert("Erro", "IP não informado");
    if (!porta) throw Alert.alert("Erro", "Porta não informada");
  }

  function configurarConexao() {
    storage.set("descricaoConexao", descricao);
    storage.set("ipConexao", ip);
    storage.set("portaConexao", porta);

    api.defaults.baseURL = `http://${ip}:${porta}/`;
  }

  async function conectarServidor() {
    const responseLicenca = await verificarLicencaLocal();
    if (!responseLicenca) throw Alert.alert("Erro", "Licença não encontrada");

    const resultadoLicenca = await gravarLicenca(
      responseLicenca.imei,
      responseLicenca.chave,
      responseLicenca.codacesso,
    );

    if (resultadoLicenca === "ERRO") {
      throw Alert.alert("Erro", "Erro ao validar licença com o servidor");
    }

    const response = await validarAcessoLocal();
    
    if (!response?.acesso) {
      throw Alert.alert("Erro", response?.mensagem);
    }
  }

  async function handleGravarConexao() {
    try {
      validarDados();
      configurarConexao();
      await conectarServidor();

      const rede = await redeEServidorAtivo();            
      if (!rede.ativo) throw Alert.alert(rede.mensagem)

      Alert.alert("Sucesso", "Conexao gravada com sucesso!");
      setIsOpen(false);
    } catch (error) {      
      Alert.alert("Erro", error.message);
    }
  }

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
        <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
          <View className="gap-y-2">
            <Input label="Descrição" value={descricao} onChangeText={setDescricao} />
            <Input label="IP" value={ip} onChangeText={setIp} />
            <Input label="Porta" value={porta} onChangeText={setPorta} />
          </View>
          <View className="gap-y-2">
            <Button texto="Gravar" onPress={handleGravarConexao} />
            <Button texto="Cancelar" variant="outline" onPress={() => setIsOpen(false)} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
