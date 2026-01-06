import { View, Alert, Modal } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/input";
import Button from "@/components/button";
import { createMMKV } from "react-native-mmkv";
import useLoginDatabase from "@/database/useLoginDatabase";
import useLicencaDatabase from "@/database/useLicencaDatabase";
import { api, gravarLicencaServidor } from "@/services/api";
import { redeEServidorAtivo } from "@/utils/funcoes";

const storage = createMMKV({ id: "storage" });

export default function ModalConexao({ isOpen, setIsOpen }) {
  const [descricao, setDescricao] = useState(storage.getString("descricaoConexao") || "");
  const [ip, setIp] = useState(storage.getString("ipConexao") || "");
  const [porta, setPorta] = useState(storage.getString("portaConexao") || "");

  const { validarAcessoLocal } = useLoginDatabase();
  const { verificarLicencaLocal } = useLicencaDatabase();

  function validarDados() {
    if (!descricao) throw new Error("Descrição não informada");
    if (!ip) throw new Error("IP não informado");
    if (!porta) throw new Error("Porta não informada");
  }

  function configurarConexao() {
    storage.set("descricaoConexao", descricao);
    storage.set("ipConexao", ip);
    storage.set("portaConexao", porta);

    api.defaults.baseURL = `http://${ip}:${porta}/`;
  }

  async function conectarServidor() {
    const responseLicenca = await verificarLicencaLocal();
    if (!responseLicenca) throw new Error("Licença não encontrada localmente");

    const resultadoLicenca = await gravarLicencaServidor(
      responseLicenca.imei,
      responseLicenca.chave,
      responseLicenca.codacesso,
    );

    if (resultadoLicenca === "ERRO") {
      throw new Error("Erro ao validar licença com o servidor");
    }

    const response = await validarAcessoLocal();
    if (!response?.acesso) {
      throw new Error(response?.mensagem || "Acesso local negado");
    }
  }

  async function handleGravarConexao() {
    try {
      validarDados();
      configurarConexao();

      const rede = await redeEServidorAtivo();
      if (!rede.ativo) throw new Error(rede.mensagem);

      await conectarServidor();

      Alert.alert("Sucesso", "Conexão gravada com sucesso!");
      setIsOpen(false);
    } catch (error) {
      storage.set("descricaoConexao", "");
      storage.set("ipConexao", "");
      storage.set("portaConexao", "");
      Alert.alert("Erro", error.message || "Erro ao gravar a conexão");
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
