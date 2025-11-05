import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/input";
import Button from "../components/button";
import { Feather } from "@expo/vector-icons";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { Image } from "react-native-css/components";
import Logo from "../assets/images/logo.png";
import { useEffect, useState } from "react";
import useLogin from "../hook/useLogin";
import ModalLicenca from "../components/modals/licenca";
import ModalConexao from "@/components/modals/conexao";

export default function Login() {
  const [codigo, setCodigo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [isLembrarLogin, setIsLembrarLogin] = useState(false);
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);

  const [isModalLicencaOpen, setIsModalLicencaOpen] = useState(false);
  const [isModalConexaoOpen, setIsModalConexaoOpen] = useState(false);

  const { inicializarLogin, efetuarLogin } = useLogin();

  async function handleLogin() {
    try {
      await efetuarLogin(codigo, usuario, senha, isLembrarLogin);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  async function carregarLogin() {
    try {
      await inicializarLogin(setIsModalLicencaOpen, setIsModalConexaoOpen, setIsPrimeiroAcesso, setCodigo, setUsuario, setSenha, isLembrarLogin, setIsLembrarLogin);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  useEffect(() => {
    carregarLogin();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D4036", paddingHorizontal: 16 }}>
      <ModalLicenca isOpen={isModalLicencaOpen} setIsOpen={setIsModalLicencaOpen} />
      <ModalConexao isOpen={isModalConexaoOpen} setIsOpen={setIsModalConexaoOpen} />

      <View className="items-center my-6">
        <TouchableOpacity onLongPress={() => setIsModalConexaoOpen(true)}>
          <Image className="w-[150px] h-[150px]" source={Logo} alt="Logo" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
          <View className="gap-y-2">
            <View className="flex-row gap-x-2">
              <Input value={codigo} onChangeText={setCodigo} classNameContainer="flex-1" label="Código" icon={<Feather name="user" size={20} color="#8B9287" />} keyboardType="numeric" />
              <Input value={usuario} onChangeText={setUsuario} classNameContainer="flex-2" label="Login" icon={<Feather name="search" size={20} color="#8B9287" />} editable={false} />
            </View>
            <Input value={senha} onChangeText={setSenha} label="Senha" secureTextEntry icon={<Feather name="lock" size={20} color="#8B9287" />} />
          </View>
          <View>
            <Button texto="Entrar" onPress={handleLogin} />
          </View>
          <View className="flex-row gap-x-1 justify-center items-center">
            <Checkbox value={isLembrarLogin} onValueChange={setIsLembrarLogin} color={isLembrarLogin ? "#47a603" : "#8B9287"} />
            <Text>Lembrar Login?</Text>
          </View>
        </View>
      </View>

      <View className="items-center mt-6 mb-2 gap-2">
        <Text className="text-white">Versão 1.0.0</Text>
        <Button size="icon" icon={<Feather name="refresh-ccw" size={24} color="white" />} />
      </View>
    </SafeAreaView>
  );
}
