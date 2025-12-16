import { SafeAreaView } from "react-native-safe-area-context";
import Input from "@/components/input";
import Button from "@/components/button";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { Image } from "react-native-css/components";
import Logo from "@/assets/images/logo.png";
import { useEffect, useState } from "react";
import ModalLicenca from "@/components/modals/licenca";
import ModalConexao from "@/components/modals/conexao";
import useLoginDatabase from "@/database/useLoginDatabase";
import { Lock, RefreshCcw, Search, User } from "lucide-react-native";
import ModalUsuarios from "@/components/modals/usuarios";
import useLicencaDatabase from "@/database/useLicencaDatabase";
import useSincronizar from "@/database/useSincronizar";
import { createMMKV } from "react-native-mmkv";

export default function Login() {
  const storage = createMMKV({
    id: "storage",
  });

  const [codigo, setCodigo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [isLembrarLogin, setIsLembrarLogin] = useState(false);
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);

  const [isModalLicencaOpen, setIsModalLicencaOpen] = useState(false);
  const [isModalConexaoOpen, setIsModalConexaoOpen] = useState(false);
  const [isModalUsuariosOpen, setIsModalUsuariosOpen] = useState(false);

  const { efetuarLoginLocal, verificarSistemaLocal } = useLoginDatabase();
  const { verificarLicencaLocal } = useLicencaDatabase();
  const { sincronizarLogin } = useSincronizar();

  async function handleLogin() {
    try {
      await efetuarLoginLocal(codigo, usuario, senha, isLembrarLogin);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  async function validarLicenca() {
    try {
      const licenca = await verificarLicencaLocal();
      if (!licenca) {
        setIsModalLicencaOpen(true);
        return;
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function verificarPrimeiroAcesso() {
    try {
      const sistema = await verificarSistemaLocal();
      return !sistema
        ? { primeiroAcesso: true, sistema: null }
        : { primeiroAcesso: false, sistema };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  function verificarConexaoGravada() {
    if (
      !storage.getString("descricaoConexao") ||
      !storage.getString("ipConexao") ||
      !storage.getString("portaConexao")
    ) {
      setIsModalConexaoOpen(true);
      return false;
    }
    return true;
  }

  function carregarCampos(codusu, nomusu, senusu) {
    setCodigo(isLembrarLogin === "S" ? String(codusu) : "");
    setUsuario(isLembrarLogin === "S" ? nomusu : "");
    setSenha(isLembrarLogin === "S" ? senusu : "");
    setIsLembrarLogin(isLembrarLogin === "S" ? true : false);
  }

  async function inicializarLogin() {
    try {
      if (!(await validarLicenca())) return;

      if (!verificarConexaoGravada()) return;

      const acesso = await verificarPrimeiroAcesso();
      setIsPrimeiroAcesso(acesso.primeiroAcesso);
      if (acesso.primeiroAcesso) return;

      const { codusu, nomusu, senusu } = acesso.sistema;
      carregarCampos(codusu, nomusu, senusu);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  async function handleSincronizar() {
    try {
      const sincronizado = await sincronizarLogin();

      const ipConexao = storage.getString("ipConexao");
      const portaConexao = storage.getString("portaConexao");
      const descricaoConexao = storage.getString("descricaoConexao");

      if (ipConexao && portaConexao && descricaoConexao) {
        setIsPrimeiroAcesso(false);
      }

      if (sincronizado.sucesso) {
        Alert.alert("Sincronização", sincronizado.mensagem);
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  useEffect(() => {
    inicializarLogin();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0D4036", paddingHorizontal: 16 }}>
      <ModalLicenca isOpen={isModalLicencaOpen} setIsOpen={setIsModalLicencaOpen} />
      <ModalConexao isOpen={isModalConexaoOpen} setIsOpen={setIsModalConexaoOpen} />
      <ModalUsuarios isOpen={isModalUsuariosOpen} setIsOpen={setIsModalUsuariosOpen} />

      <View className="items-center my-6">
        <TouchableOpacity onLongPress={() => setIsModalConexaoOpen(true)}>
          <Image className="w-[150px] h-[150px]" source={Logo} alt="Logo" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <View className="bg-white p-5 shadow rounded-xl gap-y-4 justify-center">
          <View className="gap-y-2">
            <View className="flex-row gap-x-2">
              <Input
                value={codigo}
                onChangeText={setCodigo}
                classNameContainer="flex-1"
                label="Código"
                icon={<User color="#8B9287" size={20} />}
                keyboardType="numeric"
              />
              <Input
                value={usuario}
                onChangeText={setUsuario}
                classNameContainer="flex-2"
                label="Login"
                icon={
                  <Search color="#47a603" size={20} onPress={() => setIsModalUsuariosOpen(true)} />
                }
                editable={false}
              />
            </View>
            <Input
              value={senha}
              onChangeText={setSenha}
              label="Senha"
              secureTextEntry
              icon={<Lock color="#8B9287" size={20} />}
            />
          </View>
          <View>
            <Button texto="Entrar" onPress={handleLogin} />
          </View>
          <View className="flex-row gap-x-1 justify-center items-center">
            <Checkbox
              value={isLembrarLogin}
              onValueChange={setIsLembrarLogin}
              color={isLembrarLogin ? "#47a603" : "#8B9287"}
            />
            <Text>Lembrar Login?</Text>
          </View>
        </View>
      </View>

      <View className="items-center mt-6 mb-2 gap-2">
        <Text className="text-white">Versão 1.0.0</Text>
        <Button size="icon" icon={<RefreshCcw color={"#fff"} />} onPress={handleSincronizar} />
      </View>
    </SafeAreaView>
  );
}
