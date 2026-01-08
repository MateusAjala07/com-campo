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
import { StatusBar } from "expo-status-bar";
import useUsuarioDatabase from "@/database/useUsuarioDatabase";
import Loading from "@/components/loading";
import { redeEServidorAtivo } from "@/utils/funcoes";
import useFazendaDatabase from "@/database/useFazendaDatabase";
import ModalFazendas from "@/components/modals/fazendas";
import { router } from "expo-router";
import Constants from "expo-constants";

const storage = createMMKV({
  id: "storage",
});

export default function Login() {
  const [codigo, setCodigo] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const [isLembrarLogin, setIsLembrarLogin] = useState(false);
  const [isPrimeiroAcesso, setIsPrimeiroAcesso] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mensagemLoading, setMensagemLoading] = useState("");

  const [isModalLicencaOpen, setIsModalLicencaOpen] = useState(false);
  const [isModalConexaoOpen, setIsModalConexaoOpen] = useState(false);
  const [isModalUsuariosOpen, setIsModalUsuariosOpen] = useState(false);
  const [isModalFazendasOpen, setIsModalFazendasOpen] = useState(false);

  const { efetuarLoginLocal, verificarSistemaLocal } = useLoginDatabase();
  const { verificarLicencaLocal } = useLicencaDatabase();
  const { sincronizarLogin } = useSincronizar();
  const { consultarUsuarioLocal } = useUsuarioDatabase();
  const { consultarFazendasLocal, gravarPreferenciaFazendaLocal } =
    useFazendaDatabase();

  async function handleLogin() {
    try {
      const redeEServidor = await redeEServidorAtivo();
      if (redeEServidor.ativo) {
        const agora = new Date();

        const horas = String(agora.getHours()).padStart(2, "0");
        const minutos = String(agora.getMinutes()).padStart(2, "0");
        const segundos = String(agora.getSeconds()).padStart(2, "0");

        const horario = `${horas}:${minutos}:${segundos}`;

        storage.set("ultAtuEstDep", agora.toLocaleDateString("pt-BR"));
        storage.set("horaUltAtuEstDep", horario);
      }

      await efetuarLoginLocal(codigo, usuario, senha, isLembrarLogin);

      const fazendas = await consultarFazendasLocal();
      if (fazendas.length === 1) {
        if (fazendas[0].numcompeso > 0) {
          storage.set("numCompeso", fazendas[0].numcompeso);
          storage.set("nomFazenda", fazendas[0].nomfazenda);

          router.replace("/inicio");
        }
      } else {
        setIsModalFazendasOpen(true);
      }
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  async function validarLicenca() {
    try {
      const licenca = await verificarLicencaLocal();
      if (!licenca) {
        setIsModalLicencaOpen(true);
        return false;
      }
      return true;
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
      return false;
    }
    return true;
  }

  function carregarCampos(codusu, nomusu, senusu, lembrarlogin) {
    setCodigo(lembrarlogin === "S" ? String(codusu) : "");
    setUsuario(lembrarlogin === "S" ? nomusu : "");
    setSenha(lembrarlogin === "S" ? senusu : "");
    setIsLembrarLogin(lembrarlogin === "S" ? true : false);
  }

  async function inicializarLogin() {
    try {
      if (!(await validarLicenca())) return;

      if (!verificarConexaoGravada()) return;

      const acesso = await verificarPrimeiroAcesso();

      setIsPrimeiroAcesso(acesso.primeiroAcesso);
      if (acesso.primeiroAcesso) return;

      const { codusu, nomusu, senusu, lembrarlogin } = acesso.sistema;

      carregarCampos(codusu, nomusu, senusu, lembrarlogin);
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  }

  function limparCampos() {
    setCodigo("");
    setUsuario("");
    setSenha("");
  }

  function handleBuscarUsuarios() {
    if (isPrimeiroAcesso) return;
    limparCampos();
    setIsModalUsuariosOpen(true);
  }

  function handleUsuarioModal(item) {
    setCodigo(String(item.codusu));
    setUsuario(item.nomusu);
    setIsModalUsuariosOpen(false);
  }

  async function onBuscarNomeUsuario() {
    if (!codigo) {
      setUsuario("");
      return;
    }

    const response = await consultarUsuarioLocal(codigo);

    if (!response) {
      setUsuario("");
      return;
    }

    setUsuario(response.nomusu);
  }

  async function handleSincronizar() {
    try {
      setMensagemLoading("Sincronizando...");
      setIsLoading(true);

      if (!verificarConexaoGravada()) {
        return Alert.alert(
          "Erro",
          "Para realizar a sincronização, é necessária a conexão com um servidor.",
        );
      }

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
    } finally {
      setIsLoading(false);
      setMensagemLoading("");
    }
  }

  async function handleFazenda(e) {
    storage.set("numCompeso", e.numcompeso);
    storage.set("nomFazenda", e.nomfazenda);
    await gravarPreferenciaFazendaLocal();
    router.replace("/inicio");
  }

  useEffect(() => {
    onBuscarNomeUsuario();
  }, [codigo]);

  useEffect(() => {
    inicializarLogin();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f6f8", paddingHorizontal: 16 }}>
      <StatusBar style="dark" />

      <Loading ativo={isLoading} mensagem={mensagemLoading} />

      <ModalLicenca isOpen={isModalLicencaOpen} setIsOpen={setIsModalLicencaOpen} />
      <ModalConexao isOpen={isModalConexaoOpen} setIsOpen={setIsModalConexaoOpen} />
      <ModalUsuarios
        isOpen={isModalUsuariosOpen}
        setIsOpen={setIsModalUsuariosOpen}
        handleUsuario={handleUsuarioModal}
      />
      <ModalFazendas
        isOpen={isModalFazendasOpen}
        setIsOpen={setIsModalFazendasOpen}
        handleFazenda={handleFazenda}
      />

      <View className="items-center my-6">
        <TouchableOpacity onLongPress={() => setIsModalConexaoOpen(true)}>
          <Image className="w-36 h-36" source={Logo} alt="Logo" />
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
                icon={<User color="#6a7282" size={20} />}
                keyboardType="numeric"
              />
              <View className="justify-center self-center mt-5 items-center bg-primary h-12 w-12 rounded-full">
                <Search color="#fff" size={24} onPress={handleBuscarUsuarios} />
              </View>
              <Input
                value={usuario}
                onChangeText={setUsuario}
                classNameContainer="flex-2"
                label="Login"
                editable={false}
              />
            </View>
            <Input
              value={senha}
              onChangeText={setSenha}
              label="Senha"
              secureTextEntry
              icon={<Lock color="#6a7282" size={20} />}
            />
          </View>
          <View>
            <Button texto="Entrar" onPress={handleLogin} />
          </View>
          <View className="flex-row gap-x-1 justify-center items-center">
            <Checkbox
              value={isLembrarLogin}
              onValueChange={setIsLembrarLogin}
              color={isLembrarLogin ? "#47a603" : "#6a7282"}
            />
            <Text>Lembrar Login?</Text>
          </View>
        </View>
      </View>

      <View className="items-center mt-6 mb-2 gap-2">
        <Text className="text-gray-500">Versão {Constants.expoConfig.version}</Text>
        <Button size="icon" icon={<RefreshCcw color={"#fff"} />} onPress={handleSincronizar} />
      </View>
    </SafeAreaView>
  );
}
